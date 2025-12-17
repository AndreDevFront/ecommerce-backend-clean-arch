import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { MailGateway, SendMailProps } from 'src/domain/gateways/mail.gateway';
import { EnvService } from '../env/env.service';

@Injectable()
export class ResendGateway implements MailGateway {
  private resend: Resend;

  constructor(private readonly env: EnvService) {
    this.resend = new Resend(env.getResendProduction);
  }

  async send({ to, subject, body }: SendMailProps): Promise<void> {
    try {
      const fromEmail = this.env.getMailFrom;

      const response = await this.resend.emails.send({
        from: fromEmail,
        to: to,
        subject: subject,
        html: body,
      });

      if (response.error) {
        console.error('❌ [Resend] Erro ao enviar email:', response.error);
        throw new Error(`Falha no envio de email: ${response.error.message}`);
      }

      console.log(
        `✅ [Resend] Email enviado para ${to}. ID: ${response.data?.id}`,
      );
    } catch (error) {
      console.error('❌ [Resend] Exceção capturada:', error);
      throw error;
    }
  }
}
