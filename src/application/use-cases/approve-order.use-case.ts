import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

interface ApproveOrderRequest {
  orderId: string;
}

@Injectable()
export class ApproveOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    @InjectQueue('emails') private emailQueue: Queue,
  ) {}

  async execute({ orderId }: ApproveOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.approve();

    await this.orderRepository.save(order);

    if (order.customer && order.customer.email) {
      console.log(
        '🎫 [Queue] Adicionando e-mail na fila para:',
        order.customer.email,
      );

      await this.emailQueue.add('send-email', {
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
