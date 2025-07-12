import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { PrismaService } from '@infra/database/prisma.service';
import { ConversationService } from '../conversation/conversation.service';
import { RedisModule } from '@infra/cache/redis.module';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    RedisModule
  ],
  controllers: [MessageController],
  providers: [MessageService, PrismaService, ConversationService, MessageGateway],
})
export class MessageModule {}
