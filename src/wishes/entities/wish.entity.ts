import { User } from 'src/users/entities/user.entity';
import { IsDate, IsString, Min, Max, IsUrl, IsNumber, IsInt } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @Min(2)
  @Max(250)
  name: string;

  @Column()
  @IsString()
  @Min(1)
  @Max(1024)
  description: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({
    type: 'numeric',
    scale: 2,
  })
  @IsNumber()
  price: number;

  @Column({
    type: 'numeric',
    scale: 2,
    default: 0,
  })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  offers: [];

  @Column({ default: 0 })
  @IsInt()
  copied: number;

  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
