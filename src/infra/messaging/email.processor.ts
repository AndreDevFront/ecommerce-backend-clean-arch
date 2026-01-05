import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailGateway } from 'src/domain/gateways/mail.gateway';

@Processor('emails')
export class EmailProcessor extends WorkerHost {
  constructor(private mailGateway: MailGateway) {
    super();
  }

  async process(job: Job<{ to: string; subject: string; body: string }>) {
    const { to, subject, body } = job.data;

    console.log(`📧 [Worker] Processando envio de e-mail para: ${to}`);

    await this.mailGateway.send({
      to,
      subject,
      body,
    });

    console.log(`✅ [Worker] E-mail enviado com sucesso!`);
  }
}
