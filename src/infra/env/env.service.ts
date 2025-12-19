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
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get getJwtSecret() {
    return this.configService.get('JWT_PRIVATE_KEY', { infer: true });
  }

  get getAwsAccessKeyId() {
    return this.configService.get('AWS_ACCESS_KEY_ID', { infer: true });
  }

  get getAwsBucketName() {
    return this.configService.get('AWS_BUCKET_NAME', { infer: true });
  }

  get getAwsSecretAccessKey() {
    return this.configService.get('AWS_SECRET_ACCESS_KEY', { infer: true });
  }

  get getAwsRegion() {
    return this.configService.get('AWS_REGION', { infer: true });
  }

  get getAwsEndpoint() {
    return this.configService.get('AWS_ENDPOINT', { infer: true });
  }

  get getAwsBucketPublicUrl() {
    return this.configService.get('AWS_BUCKET_PUBLIC_URL', { infer: true });
  }

  get getSmtpHost() {
    return this.configService.get('SMTP_HOST', { infer: true });
  }
  get getSmtpPort() {
    return this.configService.get('SMTP_PORT', { infer: true });
  }
  get getSmtpUser() {
    return this.configService.get('SMTP_USER', { infer: true });
  }
  get getSmtpPass() {
    return this.configService.get('SMTP_PASS', { infer: true });
  }

  get getResendProduction() {
    return this.configService.get('RESEND_PRODUCTION', { infer: true });
  }

  get getMailFrom() {
    return this.configService.get('MAIL_FROM', { infer: true });
  }

  get getStripeSecretKey() {
    return this.configService.get('STRIPE_SECRET_KEY', { infer: true });
  }

  get getStripeWebhookSecret() {
    return this.configService.get('STRIPE_WEBHOOK_SECRET', { infer: true });
  }
}
