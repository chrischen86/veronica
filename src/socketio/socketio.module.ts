import { Module } from '@nestjs/common';
import { SocketioGateway } from './socketio.gateway';

@Module({
  providers: [SocketioGateway],
})
export class SocketioModule {}
