import { UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConnectedSocket } from '@nestjs/websockets/decorators/connected-socket.decorator';
import { AuthWSGuard } from 'auth/guards/authWS.guard';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'events',
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  clients = {};
  clientsIdByUserId = {};

  handleConnection() {
    console.log('Connected');
  }

  handleDisconnect(client: Socket): any {
    const registeredClient = this.clients[client.id];
    if (registeredClient) {
      console.log('Socket removed from clients ', client.id);
      delete this.clientsIdByUserId[registeredClient.userId];
      delete this.clients[client.id];
    }
    console.log('Client disconnected');
  }

  afterInit() {
    console.log('WS Initialized');
  }

  broadcast(event, userId, data) {
    const clientId = this.clientsIdByUserId[userId];
    if (!clientId) return;

    const client = this.clients[clientId]?.client;

    if (client) {
      client.emit(event, JSON.stringify(data));
    }
  }

  @UseGuards(AuthWSGuard)
  @SubscribeMessage('identify')
  async identity(
    @MessageBody() data: { user: { id: number } },
    @ConnectedSocket() client: Socket,
  ) {
    this.clients[client.id] = { userId: data.user.id, client };
    this.clientsIdByUserId[data.user.id] = client.id;
    client.send('Identify success');
  }
}
