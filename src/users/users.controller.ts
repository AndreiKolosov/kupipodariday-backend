import { TransformPublicUserInterceptor } from './../interceptors/transform-public-user-interceptor';
import { TransformWishOwnerInterceptor } from './../interceptors/transform-wish-owner-interceptor';
import { User } from 'src/users/entities/user.entity';
import { TransformPrivetUserInterceptor } from '../interceptors/transform-privet-user-interceptor';
import { Wish } from './../wishes/entities/wish.entity';
import {
  Controller,
  Get,
  Body,
  Patch,
  Req,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { USER_DOES_NOT_EXIST } from 'src/utils/constants/users';

@Controller('users')
@UseGuards(JwtGuard)
@UseInterceptors(TransformPrivetUserInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }): Promise<User> {
    const userProfileData = await this.usersService.findById(user.id);

    if (!userProfileData) {
      throw new NotFoundException();
    }

    return userProfileData;
  }

  @Patch('me')
  async updateAuthUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateById(user.id, dto);
  }

  @Get('me/wishes')
  @UseInterceptors(TransformWishOwnerInterceptor)
  async getAuthUserWishes(@Req() { user }: { user: User }): Promise<Wish[]> {
    return await this.usersService.getUserWishes(user.username);
  }

  @Get(':username')
  @UseInterceptors(TransformPublicUserInterceptor)
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }

    return user;
  }

  @Get(':username/wishes')
  @UseInterceptors(TransformWishOwnerInterceptor)
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return await this.usersService.getUserWishes(username);
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }
}
