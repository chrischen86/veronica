import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConquestService } from '../conquest/conquest.service';
import { OwnerAlreadyAssignedWsException } from './exceptions/owner-already-assigned.exception';
import { AssignNodeDto } from './interfaces/assign-node-dto.interface';
import { JoinDto } from './interfaces/join-dto.interface';
import { ReconnectDto } from './interfaces/reconnect-dto.interface';
import { SetupZoneDto } from './interfaces/setup-zone-dto.interface';
import { UpdateZoneOrdersDto } from './interfaces/update-zone-orders-dto.interface';
import { UpdateZoneStatusDto } from './interfaces/update-zone-status-dto.interface';

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
    return {
      status: 'ok',
    };
  }

  @SubscribeMessage('assignNode')
  async handleAssignNode(socket: Socket, payload: AssignNodeDto) {
    console.log('AssignNode Message...');
    let isRejected = false;
    const { conquestId, phaseId, zoneId, nodeId, ownerId } = payload;
    try {
      await this.service.requestNode(
        conquestId,
        phaseId,
        zoneId,
        nodeId,
        ownerId,
      );
    } catch (ex) {
      const { name } = ex;
      if (name === 'ConditionalCheckFailedException') {
        isRejected = true;
      } else {
        throw ex;
      }
    }

    //Handle exception ourselves as rejection state in UI is local
    if (isRejected) {
      return {
        status: 'warn',
        message: 'Node is assigned to another',
      };
    }

    return {
      status: 'ok',
    };
  }

  @SubscribeMessage('updateZoneOrders')
  async handleUpdateZoneOrders(socket: Socket, payload: UpdateZoneOrdersDto) {
    console.log('UpdateZoneOrders Message...');
    const { conquestId, phaseId, zoneId, orders } = payload;
    await this.service.updateZone(conquestId, phaseId, zoneId, orders);
    return {
      status: 'ok',
    };
  }

  @SubscribeMessage('updateZoneStatus')
  async handleUpdateZoneStatus(socket: Socket, payload: UpdateZoneStatusDto) {
    console.log('UpdateZoneStatus Message...');
    const { conquestId, phaseId, zoneId, status } = payload;
    await this.service.updateZoneStatus(conquestId, phaseId, zoneId, status);
    return {
      status: 'ok',
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
