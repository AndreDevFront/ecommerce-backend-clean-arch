import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from '../env/env.schema';
import { MailModule } from '../mail/mail.module';
import { EmailProcessor } from './email.processor';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        connection: {
          host: config.get('REDIS_HOST', { infer: true }),
          port: config.get('REDIS_PORT', { infer: true }),
          password: config.get('REDIS_PASSWORD', { infer: true }),
          tls: {
            servername: config.get('REDIS_HOST', { infer: true }),
          },
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'emails',
    }),
    MailModule,
  ],
  controllers: [],
  providers: [EmailProcessor],
  exports: [BullModule],
})
export class MessagingModule {}
