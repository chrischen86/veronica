import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket } from '../types';

@Injectable()
export class SocketIoGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('SocketIoGuard activated');
    const client = context?.switchToWs()?.getClient<ConnectedSocket>();
    return SocketIoGuard.verifyToken(
      this.jwtService,
      client,
      client.handshake.auth.token,
    );
  }

  static async verifyToken(
    jwtService: JwtService,
    socket: ConnectedSocket,
    token?: string,
  ) {
    if (socket.conn.userId) {
      return true;
    }

    if (!token) {
      return false;
    }

    socket.conn.token = token;
    const data = await jwtService.decode(token);
    const { sub } = data;
    socket.conn.userId = sub;
    //console.log(`Setting connection userId to "${sub}"`);
    return true;
  }
}
