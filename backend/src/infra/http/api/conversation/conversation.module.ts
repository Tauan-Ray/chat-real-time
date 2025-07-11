import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { PrismaService } from '@infra/database/prisma.service';
import { Message, MessageSchema } from '../message/schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])],
  controllers: [ConversationController],
  providers: [ConversationService, PrismaService],
  exports: [ConversationService]
})
export class ConversationModule {}
