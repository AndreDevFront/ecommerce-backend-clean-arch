import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from 'src/domain/events/order-created.event';
import { MailGateway } from 'src/domain/gateways/mail.gateway';

@Injectable()
export class SendOrderEmailListener {
  constructor(private mailGateway: MailGateway) {}

  @OnEvent('order.created')
  async handle(event: OrderCreatedEvent) {
    console.log(
      `👂 Evento ouvido! Enviando email para ${event.clientEmail}...`,
    );

    await this.mailGateway.send({
      to: event.clientEmail,
      subject: `Pedido Confirmado! 🕯️ (ID: ${event.orderId.substring(0, 8)})`,
      body: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1>Olá! 👋</h1>
          <p>Seu pedido foi recebido com sucesso!</p>
          <hr />
          <p><b>ID do Pedido:</b> ${event.orderId}</p>
          <p><b>Valor Total:</b> R$ ${event.totalAmount.toFixed(2)}</p>
          <hr />
          <p>Obrigado por iluminar sua vida com nossas velas! 🕯️</p>
        </div>
      `,
    });

    console.log('✅ Email enviado com sucesso!');
  }
}
