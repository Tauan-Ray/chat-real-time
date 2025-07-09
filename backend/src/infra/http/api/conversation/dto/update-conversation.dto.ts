import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  conversationId: string;

  @IsUUID()
  @IsNotEmpty()
  lastMessageId: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  lastMessageDate: Date;
}