import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConquestModule } from './conquest/conquest.module';
import { SocketioModule } from './socketio/socketio.module';
import { DalModule } from './dal/dal.module';

@Module({
  imports: [ConquestModule, SocketioModule, DalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
