import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { MessageSocketService } from './message-socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService,
    private messageSocketService: MessageSocketService
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.messageSocketService.setServer(server)
    console.log('WebSocket inicializado');
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      client.join(userId);
      console.log(`Cliente ${client.id} conectado como usuário ${userId}`);
    } else {
      console.log(`Cliente ${client.id} conectado sem userId`);
    }
  }


  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinConversation')
  handleJoinConeversation(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket
  ) {
    client.join(conversationId);
    console.log(`Cliente ${client.id} entrou na conversa: ${conversationId}`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody() payload: any,
  ) {
    this.messageSocketService.emitMessage(payload)
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead (
    @MessageBody() payload: { messageId: string, userId: string, conversationId: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      await this.messageService.markRead(payload.userId, payload.messageId)

      this.messageSocketService.emitMessageRead(payload.conversationId, {
        messageId: payload.messageId,
        userId: payload.userId,
      });
    } catch (error) {
      client.emit('error', { error: error.message })
    }
  }
}
