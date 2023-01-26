import { User } from '../entities/user.entity';

export class PublicUserProfileDto {
  id: number;
  username: string;
  about: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;

  static getProfile(user: User): PublicUserProfileDto {
    const { id, username, about, avatar, createdAt, updatedAt } = user;
    return {
      id,
      username,
      about,
      avatar,
      createdAt,
      updatedAt,
    };
  }
}
