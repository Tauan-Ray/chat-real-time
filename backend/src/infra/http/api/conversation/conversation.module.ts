import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaService } from '@infra/database/prisma.service';
import { Message, MessageSchema } from '../message/schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@infra/cache/redis.module';
import { MessageSocketService } from '../message/message-socket.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]), RedisModule],
  controllers: [ConversationController],
  providers: [ConversationService, PrismaService, MessageSocketService],
  exports: [ConversationService]
})
export class ConversationModule {}
