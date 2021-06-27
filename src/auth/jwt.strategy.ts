import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH') auth: { issuerUrl: string; audience: string }) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${auth.issuerUrl}.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: auth.audience,
      issuer: auth.issuerUrl,
      algorithms: ['RS256'],
    });

    console.log(auth);
  }

  validate(payload: unknown): unknown {
    console.log(payload);
    return payload;
  }
}
