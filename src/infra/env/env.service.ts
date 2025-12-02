import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Env } from './env.schema';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService<Env, true>) {}

  get getDatabaseUrl() {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get getPort() {
    return this.configService.get('PORT', { infer: true });
  }
}
