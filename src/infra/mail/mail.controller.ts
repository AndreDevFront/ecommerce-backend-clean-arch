import { Body, Controller, Post } from '@nestjs/common';
import { MailGateway } from 'src/domain/gateways/mail.gateway';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';

const sendMailSchema = z.object({
  to: z.email(),
});

type SendMailDto = z.infer<typeof sendMailSchema>;

@Controller('mail')
export class MailController {
  constructor(private mailGateway: MailGateway) {}

  @Post('test')
  async test(@Body(new ZodValidationPipe(sendMailSchema)) body: SendMailDto) {
    await this.mailGateway.send({
      to: body.to,
      subject: 'Teste de Email - Velas API 🕯️',
      body: `
        <h1>Olá!</h1>
        <p>Se você está lendo isso, o <b>Nodemailer</b> com <b>Gmail</b> funcionou!</p>
        <p>Agora sua loja já sabe falar! 🗣️</p>
      `,
    });

    return { message: 'Email enviado com sucesso!' };
  }
}
