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
        const port = Number(env.getSmtpPort);
        const isSecure = port === 587;

        console.log(
          `📧 Configurando Email -> Porta: ${port} | Secure: ${isSecure}`,
        );

        return {
          transport: {
            host: env.getSmtpHost,
            port: port,
            secure: isSecure,
            auth: {
              user: env.getSmtpUser,
              pass: env.getSmtpPass,
            },
            tls: {
              ciphers: 'SSLv3',
              rejectUnauthorized: false,
            },

            connectionTimeout: 20000,
            greetingTimeout: 20000,
            socketTimeout: 20000,
          },
          defaults: {
            from: `"Velas API" <${env.getSmtpUser}>`,
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
