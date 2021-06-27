import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryHandlers } from './queries';
import { CommandHandlers } from './commands';
import { DalModule } from '../dal/dal.module';

const authFactory = {
  provide: 'AUTH',
  useFactory: (configService: ConfigService) => {
    const authConfig = configService.get('auth');
    return authConfig;
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CqrsModule,
    DalModule,
  ],
  exports: [PassportModule, UserService],
  controllers: [UserController],
  providers: [
    authFactory,
    AuthService,
    JwtStrategy,
    UserService,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class AuthModule {}
