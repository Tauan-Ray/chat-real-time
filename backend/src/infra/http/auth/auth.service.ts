import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginDto, RefreshTokenDto } from './dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { CreateUserDto } from '../user/dto';


type User = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async validateUser(data: LoginDto) {
    const user = await this.userService.findUnique(data.email)
    if (user && (await compare(data.password, user.passwordHash)) ) {
      const { passwordHash, ...result } = user;
      return result
    }

    return null
  }

  async login(user: User) {
    const payloadAccessToken = { sub: user.id, email: user.email, username: user.name }
    const payloadRefreshToken = { sub: user.id }

    return {
      access_token: this.jwtService.sign(payloadAccessToken),
      refresh_token: this.jwtService.sign(payloadRefreshToken, { expiresIn: '7d' })
    }
  }

  async refreshToken(refreshToken: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(refreshToken.refreshToken);
      const user = await this.userService.findUnique(payload.sub)

      const newAccessToken = this.jwtService.sign({
        email: user.email,
        sub: user.id,
        username: user.name,
      });
      return {
        access_token: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Token de Refresh inválido');
    }
  }


  async register(data: CreateUserDto) {
    const user = await this.userService.createUser(data);

    const payloadAccessToken = { sub: user.id, email: user.email, username: user.name }
    const payloadRefreshToken = { sub: user.id }

    return {
      access_token: this.jwtService.sign(payloadAccessToken),
      refresh_token: this.jwtService.sign(payloadRefreshToken, { expiresIn: '7d' })
    }

  }
}
