// import { MailerService } from '@nestjs-modules/mailer';
// import { Injectable } from '@nestjs/common';
// import { MailGateway, SendMailProps } from 'src/domain/gateways/mail.gateway';

// @Injectable()
// export class NodemailerGateway implements MailGateway {
//   constructor(private mailerService: MailerService) {}

//   async send({ to, subject, body }: SendMailProps): Promise<void> {
//     await this.mailerService.sendMail({
//       to,
//       subject,
//       html: body,
//     });
//   }
// }
