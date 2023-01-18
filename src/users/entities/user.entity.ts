import { IsString, Min, Max, IsEmail, IsUrl, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AVATAR_DEFAULT_LINK,
  ABOUT_DEFAULT_TEXT,
} from 'src/utils/constants/users';
import { Wish } from 'src/wishes/entities/wish.entity';

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

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: [];

  offers: [];

  wishlists: [];

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
