import * as SocketIO from 'socket.io';

export interface ConnectedSocket extends SocketIO.Socket {
  conn: SocketIO.Socket & {
    token: string;
    userId: string;
    userName?: string;
    allianceId?: string;
    allianceName?: string;
  };
}
