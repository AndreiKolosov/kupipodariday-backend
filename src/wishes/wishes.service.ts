import { NotFoundException } from '@nestjs/common/exceptions';
import { Injectable, BadRequestException } from '@nestjs/common';
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

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      take: 10,
      order: { copied: 'desc' },
      relations: ['owner', 'offers'],
    });
  }

  async findById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException('По запросу ничего не найдено');
    }

    return wish;
  }

  async updateWish(
    wishId: number,
    dto: UpdateWishDto,
    userId: number,
  ): Promise<void> {
    const wish = await this.findById(wishId);

    if (!wish) {
      throw new NotFoundException('По запросу ничего не найдено');
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException('Вы не можете изменять чужие подарки');
    }

    await this.wishesRepository.update(wishId, dto);
  }

  async deleteById(wishId: number, userId: number): Promise<Wish> {
    const wish = await this.findById(wishId);
    if (!wish) {
      throw new NotFoundException('По запросу ничего не найдено');
    }

    if (wish.owner.id !== userId) {
      throw new BadRequestException('Вы не можете изменять чужие подарки');
    }

    await this.wishesRepository.delete(wishId);

    return wish;
  }
}
