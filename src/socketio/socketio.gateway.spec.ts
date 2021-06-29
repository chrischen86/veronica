import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../auth/auth.module';
import configuration from '../config/configuration';
import { ConquestModule } from '../conquest/conquest.module';
import { SocketInterceptor } from './interceptors/socket.interceptor';
import { SocketioGateway } from './socketio.gateway';

describe('SocketioGateway', () => {
  let gateway: SocketioGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketioGateway, SocketInterceptor],
      imports: [
        ConquestModule,
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        JwtModule.register({}),
        AuthModule,
      ],
    }).compile();

    gateway = module.get<SocketioGateway>(SocketioGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
