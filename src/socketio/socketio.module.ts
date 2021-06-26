import { Module } from '@nestjs/common';
import { ConquestModule } from '../conquest/conquest.module';
import { SocketioGateway } from './socketio.gateway';
import { ConquestCreatedTestSocketHandler } from './another.handler';
import { EventHandlers } from './events';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [
    SocketioGateway,
    ConquestCreatedTestSocketHandler,
    ...EventHandlers,
  ],
  imports: [ConquestModule, JwtModule.register({})],
  exports: [JwtModule],
})
export class SocketioModule {}
