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
      useFactory: (env: EnvService) => {
        const host = env.getSmtpHost;
        const port = Number(env.getSmtpPort);
        const user = env.getSmtpUser;
        const pass = env.getSmtpPass;

        const isSecure = port === 465;

        console.log(
          `📧 [MailModule] Iniciando configuração -> Host: ${host} | Porta: ${port} | Secure: ${isSecure}`,
        );

        return {
          transport: {
            host: host,
            port: port,
            secure: isSecure,
            auth: {
              user: user,
              pass: pass,
            },
            tls: {
              rejectUnauthorized: false,
            },

            debug: true,
            logger: true,

            connectionTimeout: 20000,
            greetingTimeout: 20000,
            socketTimeout: 20000,
          },
          defaults: {
            from: `"Velas API" <${user}>`,
          },
        };
      },
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
