import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { EnvService } from '../env/env.service';
import { z } from 'zod';

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getJwtSecret,
      ignoreExpiration: false,
    });
  }

  validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
