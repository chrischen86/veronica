import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConquestService } from 'src/conquest/conquest.service';
import { JoinDto } from './interfaces/join-dto.interface';
import { SetupZoneDto } from './interfaces/setup-zone-dto.interface';

@WebSocketGateway()
export class SocketioGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly service: ConquestService) {}

  @SubscribeMessage('join')
  async handleJoin(socket: Socket, payload: JoinDto) {
    const { roomNumber } = payload;

    const conquest = await this.service.findOneConquest(roomNumber);
    console.log(conquest);
    if (conquest === null) {
      return {
        status: 'error',
        message: 'Conquest does not exist',
      };
    }

    console.log(`joining ${roomNumber}`);
    socket.join(roomNumber);

    return {
      status: 'ok',
      conquestState: conquest,
    };
  }

  @SubscribeMessage('setupZone')
  async handleSetupZone(socket: Socket, payload: SetupZoneDto) {
    console.log('SetupZoneMessage...');
    const { conquestId, phaseId, holds, zone } = payload;

    // const conquest = await this.service.findOneConquest(conquestId);
    // if (conquest === null) {
    //   return {
    //     status: 'error',
    //     message: 'Conquest does not exist',
    //   };
    // }

    await this.service.createZone(conquestId, phaseId, zone, holds);
    const updatedConquest = await this.service.findOneConquest(conquestId);

    return {
      status: 'ok',
      conquestState: updatedConquest,
    };
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
