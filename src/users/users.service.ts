import { NotFoundException } from '@nestjs/common/exceptions';
import { HashService } from './../hash/hash.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  USER_ALREADY_EXIST,
  USER_DOES_NOT_EXIST,
} from 'src/utils/constants/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.usersRepository.save({
      ...dto,
      password: await this.hashService.hash(dto.password),
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();

    for (const user of users) {
      delete user.password;
    }

    return users;
  }

  async findByUsername(username: string): Promise<User> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async updateById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const foundedUserByEmail = await this.findByEmail(dto.email);
      if (foundedUserByEmail) {
        throw new BadRequestException(USER_ALREADY_EXIST);
      }
    }

    if (dto.username && dto.username !== user.username) {
      const foundedUserByUsername = await this.findByUsername(dto.username);
      if (foundedUserByUsername) {
        throw new BadRequestException(USER_ALREADY_EXIST);
      }
    }

    if (dto.password) {
      dto.password = await this.hashService.hash(dto.password);
    }

    await this.usersRepository.update(id, dto);

    const updatedUser = await this.findById(id);

    return updatedUser;
  }

  async getUserWishes(username: string): Promise<Wish[]> {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }

    const { id } = user;
    const { wishes } = await this.usersRepository.findOne({
      where: { id },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });

    for (const wish of wishes) {
      delete wish.owner.password;
      delete wish.owner.email;
    }

    return wishes;
  }

  async findMany(query: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: [{ username: Like(`${query}%`) }, { email: Like(`${query}%`) }],
    });

    for (const user of users) {
      delete user.password;
    }

    return users;
  }
}
