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
      `👂 Processando venda ${event.orderId} via ${event.paymentMethod}...`,
    );

    let paymentInstructions = '';

    if (event.paymentMethod === 'pix') {
      paymentInstructions = `
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
            <p style="color: #166534; margin: 0;"><b>Pagamento via PIX 💠</b></p>
            <p>Aguardamos seu Pix no valor de <b>R$ ${event.totalAmount.toFixed(2)}</b>.</p>
            <p><b>Chave Pix:</b> (CNPJ ou Celular)</p>
            <p><small>Envie o comprovante respondendo este e-mail.</small></p>
        </div>
      `;
    } else {
      paymentInstructions = `
        <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe;">
            <p style="color: #1e40af; margin: 0;"><b>Pagamento via Cartão 💳</b></p>
            <p>Obrigado! Seu pagamento de <b>R$ ${event.totalAmount.toFixed(2)}</b> está sendo processado pela operadora.</p>
            <p>Você receberá uma confirmação assim que for aprovado.</p>
        </div>
      `;
    }

    await this.mailGateway.send({
      to: event.clientEmail,
      subject: `Recebemos seu pedido! 🕯️ (ID: ${event.orderId.substring(0, 8)})`,
      body: `
        <div style="font-family: sans-serif; color: #333;">
            <h1>Olá! Seu pedido foi registrado.</h1>
            <p>Estamos muito felizes com sua compra.</p>
            
            ${paymentInstructions} <br/>
            <p>Em breve enviaremos atualizações sobre o envio.</p>
        </div>
      `,
    });

    await this.mailGateway.send({
      to: 'andreluzdasilva10@gmail.com',
      subject: `💰 NOVA VENDA (${event.paymentMethod.toUpperCase()})! R$ ${event.totalAmount.toFixed(2)}`,
      body: `
        <h1>Parabéns! Venda Nova!</h1>
        <p><b>Cliente:</b> ${event.clientEmail}</p>
        <p><b>Valor:</b> R$ ${event.totalAmount.toFixed(2)}</p>
        <p><b>Método:</b> ${event.paymentMethod === 'pix' ? '💠 PIX' : '💳 Cartão'}</p>
        <p><b>ID:</b> ${event.orderId}</p>
        <hr/>
      `,
    });

    console.log('✅ Email enviado com sucesso!');
  }
}
