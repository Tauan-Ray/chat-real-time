import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [AuthModule, UserModule, ApiModule],
})
export class HttpModule {}
