import { Body, Controller, Post, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto';
import { CreateUserDto } from '../user/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login/")
  async signIn(@Body() data: LoginDto) {
    const user = await this.authService.validateUser(data)

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos')
    }

    return this.authService.login(user)
  }

  @Post('register/')
  async register(@Body() data: CreateUserDto) {
    return await this.authService.register(data)
  }

  @Post('refresh/')
  async refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken)
  }
}
