import { IsEmail, IsOptional, IsString, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Max(30)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @Max(200)
  @IsOptional()
  about: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
