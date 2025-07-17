import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class MessageSocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitNewMessage(conversationId: string, message: any) {
    this.server.to(conversationId).emit('receive_new_last_message', {
      conversationId,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      participantName: message.participantName,
    });
  }

  emitMessageRead(conversationId: string, payload: any) {
    this.server.to(conversationId).emit('messageRead', payload);
  }

  emitMessage(payload: any) {
    this.server.to(payload.conversationId).emit('receiveMessage', payload);
  }

  emitNewConversation(userId: string, payload: any) {
    this.server.to(userId).emit('newConversationCreated', payload);
  }
}
