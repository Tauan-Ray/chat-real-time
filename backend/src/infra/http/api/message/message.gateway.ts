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

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
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

  async notifyNewMessage(conversationId: string, message: any) {
    this.server.to(conversationId).emit('receive_new_last_message', {
      conversationId,
      content: message.content,
      senderId: message.senderId,
      createdAt: message.createdAt,
      participantName: message.participantName,
    });
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
    this.server.to(payload.conversationId).emit('receiveMessage', payload);
  }
}
