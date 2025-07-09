import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto';
import { JwtAuthGuard } from '@infra/http/auth/jwt-auth.guard';

@Controller('message')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('get-messages/:conversationId')
  async getMessages(@Request() req, @Param('conversationId') conversationId: string, @Query('page') page: string, @Query('pageLimit') pageLimit: string) {
    const { user } = req;

    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = pageLimit ? parseInt(pageLimit, 10) : 10;

    return this.messageService.getMessages(user.userId, conversationId, pageNumber, limitNumber)
  }

  @Get('unread-messages')
  async getUnreadMessages(@Request() req, @Query('conversationId') conversationId: string) {
    const { user } = req

    return this.messageService.getUnreadMessages(user.userId, conversationId)
  }

  @Post('create-message/')
  async createMessage(@Request() req, @Body() data: CreateMessageDto) {
    const { user } = req;

    return this.messageService.createMessage(user.userId, data.conversationId, data.content)
  }

  @Patch('mark-read/:messageId')
  async markAsRead(@Request() req, @Param('messageId') messageId: string) {
    const { user } = req

    return this.messageService.markRead(user.userId, messageId)

  }

  @Delete('delete-message/:messageId')
  async deleteMessage(@Request() req, @Param('messageId') messageId: string) {
    const { user } = req;

    return this.messageService.deleteMessage(user.userId, messageId)
  }

}
