import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/domain/events/order-created.event';
import { MailGateway } from 'src/domain/gateways/mail.gateway';

@Injectable()
export class SendOrderEmailListener {
  constructor(private mailGateway: MailGateway) {}

  @OnEvent('order.created')
  async handle(event: OrderCreatedEvent) {
    console.log(`👂 Processando venda ${event.orderId}...`);

    await this.mailGateway.send({
      to: event.clientEmail,
      subject: `Recebemos seu pedido! 🕯️ (ID: ${event.orderId.substring(0, 8)})`,
      body: `
        <h1>Olá! Seu pedido foi registrado.</h1>
        <p>Aguardamos seu Pix no valor de <b>R$ ${event.totalAmount.toFixed(2)}</b>.</p>
        <p>Chave Pix: (CNPJ ou Celular da sua amiga)</p>
        <p>Envie o comprovante respondendo este e-mail.</p>
      `,
    });

    await this.mailGateway.send({
      to: 'andreluzdasilva10@gmail.com',
      subject: `💰 NOVA VENDA! R$ ${event.totalAmount.toFixed(2)}`,
      body: `
        <h1>Parabéns! Venda Nova!</h1>
        <p><b>Cliente:</b> ${event.clientEmail}</p>
        <p><b>Valor:</b> R$ ${event.totalAmount.toFixed(2)}</p>
        <p><b>ID:</b> ${event.orderId}</p>
        <hr/>
        <p>Fique atenta ao App do Banco e aguarde o comprovante.</p>
      `,
    });

    console.log('✅ Email enviado com sucesso!');
  }
}
