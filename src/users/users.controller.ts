import { Wish } from './../wishes/entities/wish.entity';
import { Controller, Get, Body, Patch, Req, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common/exceptions';
import { UseGuards } from '@nestjs/common/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PublicUserProfileDto } from './dto/public-user-profile.dto';
import { ProfileUserDto } from './dto/profile-user.dto';
import { USER_DOES_NOT_EXIST } from 'src/utils/constants/users';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }): Promise<ProfileUserDto> {
    const userProfileData = await this.usersService.findById(user.id);

    if (!userProfileData) {
      throw new NotFoundException();
    }

    return ProfileUserDto.getProfile(userProfileData);
  }

  @Patch('me')
  async updateAuthUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<ProfileUserDto> {
    const updatedUser = await this.usersService.updateById(user.id, dto);

    return ProfileUserDto.getProfile(updatedUser);
  }

  @Get('me/wishes')
  async getAuthUserWishes(@Req() { user }: { user: User }) {
    return await this.usersService.getUserWishes(user.username);
  }

  @Get(':username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<PublicUserProfileDto> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }

    return PublicUserProfileDto.getProfile(user);
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return await this.usersService.getUserWishes(username);
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User[]> {
    return await this.usersService.findMany(query);
  }
}
