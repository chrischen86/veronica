import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from '../../auth/user.service';
import { ConnectedSocket } from '../types';

@Injectable()
export class SocketInterceptor implements NestInterceptor {
  constructor(private readonly service: UserService) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    console.log('Before...');

    const socket = context?.switchToWs()?.getClient<ConnectedSocket>();
    await SocketInterceptor.enrichSocket(socket, this.service);

    return next.handle();
  }

  static async enrichSocket(socket: ConnectedSocket, service: UserService) {
    const {
      conn: { userId, userName, allianceId },
    } = socket;

    if (userName !== undefined && allianceId !== undefined) {
      console.log('already have values');
      return;
    }

    const user = await service.findOneUser(userId);
    if (user === null) {
      console.log('no user found');
      return;
    }
    console.log('enriching');

    socket.conn.userName = user.name;
    socket.conn.allianceId = user.allianceId;
  }
}
