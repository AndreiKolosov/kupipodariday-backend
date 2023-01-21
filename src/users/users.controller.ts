import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll();
    const preparedUsers = users.map((user) => {
      delete user.password;
      return user;
    });

    return preparedUsers;
  }

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }) {
    const userData = await this.usersService.findById(user.id);
    if (!userData) {
      throw new NotFoundException();
    }

    return userData;
  }
}
