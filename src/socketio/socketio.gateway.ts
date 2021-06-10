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
    await this.service.requestNode(
      conquestId,
      phaseId,
      zoneId,
      nodeId,
      ownerId,
    );
    const updatedConquest = await this.service.findOneConquest(conquestId);
    const { phases } = updatedConquest;
    const phase = phases.find((p) => p.id === phaseId);

    const errorResponse = {
      status: 'error',
      conquestState: updatedConquest,
    };

    if (phase === undefined) {
      return errorResponse;
    }
    const { zones } = phase;
    const zone = zones.find((z) => z.id === zoneId);
    if (zone === undefined) {
      return errorResponse;
    }
    const { nodes } = zone;
    const node = nodes.find((n) => n.id === nodeId);
    if (node === undefined) {
      return errorResponse;
    }

    if (ownerId !== node.ownerId) {
      return {
        status: 'warn',
        message: 'Node is assigned to another',
        conquestState: updatedConquest,
      };
    }

    return {
      status: 'ok',
      conquestState: updatedConquest,
    };
  }

  @SubscribeMessage('updateZoneOrders')
  async handleUpdateZoneOrders(socket: Socket, payload: UpdateZoneOrdersDto) {
    console.log('UpdateZoneOrders Message...');
    const { conquestId, phaseId, zoneId, orders } = payload;
    await this.service.updateZone(conquestId, phaseId, zoneId, orders);
    const updatedConquest = await this.service.findOneConquest(conquestId);
    return {
      status: 'ok',
      conquestState: updatedConquest,
    };
  }

  @SubscribeMessage('updateZoneStatus')
  async handleUpdateZoneStatus(socket: Socket, payload: UpdateZoneStatusDto) {
    console.log('UpdateZoneStatus Message...');
    const { conquestId, phaseId, zoneId, status } = payload;
    await this.service.updateZoneStatus(conquestId, phaseId, zoneId, status);
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
