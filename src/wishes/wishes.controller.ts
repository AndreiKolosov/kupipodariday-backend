import { TransformWishOwnerInterceptor } from '../interceptors/transform-wish-owner-interceptor';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
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

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findById(Number(id));
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ): Promise<void> {
    await this.wishesService.updateWish(Number(id), dto, user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Wish> {
    return await this.wishesService.deleteById(Number(id), user.id);
  }
}
