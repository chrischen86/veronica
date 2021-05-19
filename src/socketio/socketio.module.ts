import { Module } from '@nestjs/common';
import { ConquestModule } from '../conquest/conquest.module';
import { SocketioGateway } from './socketio.gateway';

import { ConquestCreatedTestSocketHandler } from './another.handler';

@Module({
  providers: [SocketioGateway, ConquestCreatedTestSocketHandler],
  imports: [ConquestModule],
})
export class SocketioModule {}
