import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConquestService } from '../conquest/conquest.service';
import { ClearNodeDto } from '../conquest/dtos/clear-node.dto';
import { RequestNodeDto } from '../conquest/dtos/request-node.dto';
import { SocketIoGuard } from './guards/socketio.guard';
import { SocketInterceptor } from './interceptors/socket.interceptor';
import { JoinDto } from './interfaces/join-dto.interface';
import { ReconnectDto } from './interfaces/reconnect-dto.interface';
import { SetupZoneDto } from './interfaces/setup-zone-dto.interface';
import { UpdateNodeDto } from './interfaces/update-node-dto.interface';
import { UpdateZoneOrdersDto } from './interfaces/update-zone-orders-dto.interface';
import { UpdateZoneStatusDto } from './interfaces/update-zone-status-dto.interface';
import { ConnectedSocket } from './types';

@UseGuards(SocketIoGuard)
@UseInterceptors(SocketInterceptor)
@WebSocketGateway()
export class SocketioGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly service: ConquestService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(socket: Socket, ...args: any[]) {
    const authorized = await SocketIoGuard.verifyToken(
      this.jwtService,
      socket,
      socket.handshake.auth.token,
    );
    if (!authorized) {
      //socket.disconnect();
      //throw new WsException('Unauthorized user');
      console.log('*******not authed');
    }
    console.log(`${socket.conn.userId} Connected to gateway`);
  }

  @SubscribeMessage('join')
  async handleJoin(socket: ConnectedSocket, payload: JoinDto) {
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
  async handleSetupZone(socket: ConnectedSocket, payload: SetupZoneDto) {
    console.log('SetupZoneMessage...');
    console.log(socket.conn.userId);
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
  async handleAssignNode(socket: ConnectedSocket, payload: RequestNodeDto) {
    console.log('AssignNode Message...');
    let isRejected = false;
    const { userId: ownerId, userName: ownerName } = socket.conn;
    payload.ownerId = ownerId;
    payload.ownerName = ownerName;

    try {
      await this.service.requestNode(payload);
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

  @SubscribeMessage('clearNode')
  async handleClearNode(socket: ConnectedSocket, payload: ClearNodeDto) {
    console.log('ClearNode Message...');
    await this.service.clearNode(payload);
    return {
      status: 'ok',
    };
  }

  @SubscribeMessage('updateNode')
  async handleUpdateNode(socket: Socket, payload: UpdateNodeDto) {
    console.log('UpdateNode Message...');
    const { conquestId, phaseId, zoneId, nodeId, ownerId, status } = payload;
    await this.service.updateNode(
      conquestId,
      phaseId,
      zoneId,
      nodeId,
      ownerId,
      status,
    );

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
