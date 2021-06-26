import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

const authFactory = {
  provide: 'AUTH',
  useFactory: (configService: ConfigService) => {
    const authConfig = configService.get('auth');
    return authConfig;
  },
  inject: [ConfigService],
};

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthService, JwtStrategy, authFactory],
  exports: [PassportModule],
})
export class AuthModule {}
