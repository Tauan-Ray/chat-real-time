import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  conversationId: string;

  @Prop({ required: true, type: String })
  senderId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  readBy: string[];

  @Prop({ default: null })
  deletedAt: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.set('timestamps', true);
