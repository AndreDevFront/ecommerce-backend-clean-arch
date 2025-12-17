import { Module } from '@nestjs/common';
import { MailGateway } from 'src/domain/gateways/mail.gateway';
import { EnvModule } from '../env/env.module';
import { MailController } from './mail.controller';
import { ResendGateway } from './resend.gateway';

@Module({
  imports: [EnvModule],
  controllers: [MailController],
  providers: [
    {
      provide: MailGateway,
      useClass: ResendGateway,
    },
  ],
  exports: [MailGateway],
})
export class MailModule {}
