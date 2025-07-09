import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [InfraModule, ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URI)],
})
export class AppModule {}
