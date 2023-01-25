import { NotFoundException } from '@nestjs/common/exceptions';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  auth(user: User) {
    const payload = { email: user.email };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователя с таким именем не существует');
    }

    const isPasswordCorrect: boolean = await this.hashService.compare(
      password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        'Неправельный пароль или имя пользователя',
      );
    }

    delete user.password;

    return user;
  }
}
