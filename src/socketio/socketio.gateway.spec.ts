import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import configuration from '../config/configuration';
import { ConquestModule } from '../conquest/conquest.module';
import { SocketioGateway } from './socketio.gateway';

describe('SocketioGateway', () => {
  let gateway: SocketioGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketioGateway],
      imports: [
        ConquestModule,
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        JwtModule.register({}),
      ],
    }).compile();

    gateway = module.get<SocketioGateway>(SocketioGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
