import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findOne(@Request() req) {
    const { user } = req
    return await this.userService.findUnique(user.userId)
  }

  @Get('/:email')
  async findByEmail(@Param('email') email: string) {
    return await this.userService.findUnique(email)
  }

}
