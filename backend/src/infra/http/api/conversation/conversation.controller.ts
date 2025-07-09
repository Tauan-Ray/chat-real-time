import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { JwtAuthGuard } from '@infra/http/auth/jwt-auth.guard';
import { UpdateConversationDto } from './dto';

@UseGuards(JwtAuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get('all-conversations')
  async getConversations(@Request() req, @Query('page') page?: string, @Query('pageLimit') pageLimit?: string) {
    const { user } = req;

    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = pageLimit ? parseInt(pageLimit, 10) : 10;

    return this.conversationService.getConversations(user.userId, pageNumber, limitNumber)
  }

  @Post('create-conversation')
  async createConversation(@Request() req, @Body('participantId') participantId: string,) {
    const { user } = req;

    return this.conversationService.createConversation(user.userId, participantId)
  }

  @Patch('update-conversation')
  async updateConversation(@Request() req, @Body() data: UpdateConversationDto) {
    const { user } = req

    return this.conversationService.updateConversation(
      user.userId,
      data.conversationId,
      data.lastMessageId,
      data.lastMessageDate
    )
  }


  @Delete('delete-conversation/:conversationId')
  async deleteConversation(@Request() req, @Param('conversationId') conversationId: string) {
    const { user } = req

    return this.conversationService.deleteConversation(user.userId, conversationId)
  }
}
