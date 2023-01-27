import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly usersService: UsersService,
  ) {}

  async findAll(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: ['owner', 'offers'],
    });

    return wishes;
  }

  async createWish(dto: CreateWishDto, ownerId: number): Promise<void> {
    const user = await this.usersService.findById(ownerId);
    await this.wishesRepository.save({
      ...dto,
      owner: user,
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    const lastWishes = await this.wishesRepository.find({
      take: 50,
      order: { createdAt: 'desc' },
      relations: ['owner', 'offers'],
    });

    return lastWishes;
  }
}
