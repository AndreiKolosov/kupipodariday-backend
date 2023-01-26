import { User } from '../entities/user.entity';

export class ProfileUserDto {
  id: number;
  username: string;
  about: string;
  avatar: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  static getProfile(user: User): ProfileUserDto {
    const { id, username, about, avatar, email, createdAt, updatedAt } = user;
    return {
      id,
      username,
      about,
      avatar,
      email,
      createdAt,
      updatedAt,
    };
  }
}
