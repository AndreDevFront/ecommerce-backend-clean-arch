import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailGateway } from 'src/domain/gateways/mail.gateway';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { MailController } from './mail.controller';
import { NodemailerGateway } from './nodemailer.gateway';

@Module({
  imports: [
    EnvModule,
    MailerModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        transport: {
          host: env.getSmtpHost,
          port: env.getSmtpPort,
          secure: env.getSmtpPort === 465,
          auth: {
            user: env.getSmtpUser,
            pass: env.getSmtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"Velas API" <${env.getSmtpUser}>`,
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [
    {
      provide: MailGateway,
      useClass: NodemailerGateway,
    },
  ],
  exports: [MailGateway],
})
export class MailModule {}
