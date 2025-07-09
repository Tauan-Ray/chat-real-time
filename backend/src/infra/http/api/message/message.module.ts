import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { PrismaService } from '@infra/database/prisma.service';
import { ConversationService } from '../conversation/conversation.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])
  ],
  controllers: [MessageController],
  providers: [MessageService, PrismaService, ConversationService],
})
export class MessageModule {}
