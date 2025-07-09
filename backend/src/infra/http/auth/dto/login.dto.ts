import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 20, {
    message: 'Sua senha deve ter no mínimo 8 caracteres e no máximo 20',
  })
  password: string;
}