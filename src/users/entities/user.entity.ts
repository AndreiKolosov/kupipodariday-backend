import { IsString, Min, Max, IsEmail, IsUrl } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  AVATAR_DEFAULT_LINK,
  ABOUT_DEFAULT_TEXT,
} from 'src/utils/constants/users';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsString()
  @Min(2)
  @Max(30)
  username: string;

  @Column({ default: ABOUT_DEFAULT_TEXT })
  @IsString()
  @Min(2)
  @Max(200)
  about: string;

  @Column({ default: AVATAR_DEFAULT_LINK })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  wishes: [];

  offers: [];

  wishlists: [];
}
