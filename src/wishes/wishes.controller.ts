import { TransformWishOwnerInterceptor } from '../interceptors/transform-wish-owner-interceptor';
import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
@UseInterceptors(TransformWishOwnerInterceptor)
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createWish(
    @Req() req: { user: User },
    @Body() dto: CreateWishDto,
  ): Promise<void> {
    return await this.wishesService.createWish(dto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAllWishes(): Promise<Wish[]> {
    return await this.wishesService.findAll();
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes();
  }
}
