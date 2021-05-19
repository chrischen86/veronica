import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConquestService } from 'src/conquest/conquest.service';

@WebSocketGateway()
export class SocketioGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: ConquestService) {}

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  @SubscribeMessage('createRoom')
  handleCreateRoom(socket: Socket, message: string): any {
    console.log('createGame');
    console.log(message);
    socket.join('conquest1');

    return {
      status: 'ok',
      players: [],
      gameState: {
        words: [],
        status: 'NOT_STARTED',
        players: [],
        hostId: '',
        turnOrder: [],
        turn: 1,
      },
      roomNumber: '1',
    };
  }
}
