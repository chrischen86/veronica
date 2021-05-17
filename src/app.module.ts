import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConquestModule } from './conquest/conquest.module';
import { SocketioModule } from './socketio/socketio.module';

@Module({
  imports: [ConquestModule, SocketioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
