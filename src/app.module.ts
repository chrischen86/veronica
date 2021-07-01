import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConquestModule } from './conquest/conquest.module';
import { SocketioModule } from './socketio/socketio.module';
import { DalModule } from './dal/dal.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AllianceModule } from './alliance/alliance.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConquestModule,
    SocketioModule,
    DalModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AuthModule,
    AllianceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
