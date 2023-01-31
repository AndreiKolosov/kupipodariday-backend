import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import {
  OFFER_NOT_FOUND,
  RAISED_EXCEEDS_PRICE,
  WISH_OWNER_CAN_NOT_PAY,
} from 'src/utils/constants/offer';
import { USER_DOES_NOT_EXIST } from 'src/utils/constants/users';
import { WISH_NOT_FOUND } from 'src/utils/constants/wishes';
import { WishesService } from 'src/wishes/wishes.service';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { getCalculatedRaised } from './helpers';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  async findAll(): Promise<Offer[]> {
    return await this.offersRepository.find({ relations: ['item', 'user'] });
  }

  async findById(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new NotFoundException(OFFER_NOT_FOUND);
    }

    delete offer.user.password;

    return offer;
  }

  async createOffer(dto: CreateOfferDto, userId: number): Promise<Offer> {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }

    delete user.password;

    const wish = await this.wishesService.findById(dto.itemId);

    if (!wish) {
      throw new NotFoundException(WISH_NOT_FOUND);
    }

    if (wish.owner.id === user.id) {
      throw new BadRequestException(WISH_OWNER_CAN_NOT_PAY);
    }

    const calculatedRaised = getCalculatedRaised(
      Number(wish.raised),
      dto.amount,
    );

    if (calculatedRaised > wish.price) {
      throw new BadRequestException(RAISED_EXCEEDS_PRICE);
    }

    await this.wishesService.updateWishRaised(wish.id, calculatedRaised);

    const createdOffer = this.offersRepository.create({
      ...dto,
      user,
      item: wish,
    });

    return this.offersRepository.save(createdOffer);
  }
}
