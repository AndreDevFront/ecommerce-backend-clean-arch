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

  get isDevelopment(): boolean {
    return (
      this.configService.get('NODE_ENV', { infer: true }) === 'development'
    );
  }

  get getJwtSecret() {
    return this.configService.get('JWT_PRIVATE_KEY', { infer: true });
  }
}
