import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class SocketioGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(socket: Socket, message: string): any {
    console.log('createGame');

    console.log(message);

    return { status: 'ok' };
  }
}
