import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConquestService } from 'src/conquest/conquest.service';
import { AssignNodeDto } from './interfaces/assign-node-dto.interface';
import { JoinDto } from './interfaces/join-dto.interface';
import { ReconnectDto } from './interfaces/reconnect-dto.interface';
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

  @SubscribeMessage('assignNode')
  async handleAssignNode(socket: Socket, payload: AssignNodeDto) {
    console.log('AssignNode Message...');
    const { conquestId, phaseId, zoneId, nodeId, ownerId } = payload;
    await this.service.updateNode(conquestId, phaseId, zoneId, nodeId, ownerId);
    const updatedConquest = await this.service.findOneConquest(conquestId);
    return {
      status: 'ok',
      conquestState: updatedConquest,
    };
  }

  @SubscribeMessage('reconnectSync')
  async handleReconnect(socket: Socket, payload: ReconnectDto) {
    console.log('ReconnectSync Message...');
    const { conquestId } = payload;
    const conquestState = await this.service.findOneConquest(conquestId);

    if (conquestState === null) {
      return {
        status: 'error',
        message: 'Conquest no longer exists',
      };
    }

    socket.join(conquestId);
    return {
      status: 'ok',
      conquestState,
    };
  }
}
