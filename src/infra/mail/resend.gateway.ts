import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { MailGateway, SendMailProps } from 'src/domain/gateways/mail.gateway';
import { EnvService } from '../env/env.service';

interface ResendError {
  message: string;
  statusCode?: number;
  name?: string;
}

@Injectable()
export class ResendGateway implements MailGateway {
  private resend: Resend;

  constructor(private readonly env: EnvService) {
    this.resend = new Resend(env.getResendProduction);
  }

  async send(props: SendMailProps): Promise<void> {
    await this.sendWithRetry(props);
  }

  private async sendWithRetry(
    props: SendMailProps,
    attempts = 0,
  ): Promise<void> {
    const MAX_RETRIES = 3;

    try {
      const fromEmail = this.env.getMailFrom;

      const response = await this.resend.emails.send({
        from: fromEmail,
        to: props.to,
        subject: props.subject,
        html: props.body,
      });

      if (response.error) {
        if (response.error.name === 'rate_limit_exceeded') {
          throw new Error('RATE_LIMIT');
        }

        console.error('❌ [Resend] Erro ao enviar email:', response.error);
        throw new Error(`Falha no envio: ${response.error.message}`);
      }

      console.log(`✅ [Resend] Email enviado! ID: ${response.data?.id}`);
    } catch (error) {
      const err = error as ResendError;

      const isRateLimit =
        err?.message === 'RATE_LIMIT' || err?.statusCode === 429;

      if (isRateLimit && attempts < MAX_RETRIES) {
        console.warn(
          `⚠️ [Resend] Rate limit atingido. Tentativa ${attempts + 1} de ${MAX_RETRIES}. Aguardando...`,
        );

        await new Promise((resolve) => setTimeout(resolve, 2000));

        return this.sendWithRetry(props, attempts + 1);
      }

      console.error('❌ [Resend] Falha definitiva:', err);
      throw error;
    }
  }
}
