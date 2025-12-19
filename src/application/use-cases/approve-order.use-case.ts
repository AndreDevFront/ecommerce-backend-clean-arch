import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { MailGateway } from 'src/domain/gateways/mail.gateway';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

interface ApproveOrderRequest {
  orderId: string;
}

@Injectable()
export class ApproveOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private mailGateway: MailGateway,
  ) {}

  async execute({ orderId }: ApproveOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.approve();

    await this.orderRepository.save(order);

    if (order.customer && order.customer.email) {
      console.log('📧 Tentando enviar email para:', order.customer.email);

      await this.mailGateway.send({
        to: order.customer.email,
        subject: 'Pagamento Aprovado! 🕯️',
        body: `Olá ${order.customer.name}, seu pagamento foi confirmado e estamos preparando suas velas!`,
      });
    } else {
      console.warn(
        '⚠️ Email não enviado: customerInfo ou email faltando no pedido.',
      );
    }

    return order;
  }
}
