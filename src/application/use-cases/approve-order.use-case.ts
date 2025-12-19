import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { MailGateway } from 'src/domain/gateways/mail.gateway';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

interface ApproveOrderRequest {
  orderId: string;
}

type OrderWithClient = Order & {
  client: {
    name: string;
    email: string;
  };
};

@Injectable()
export class ApproveOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private mailGateway: MailGateway,
  ) {}

  async execute({ orderId }: ApproveOrderRequest): Promise<Order> {
    const order = (await this.orderRepository.findById(
      orderId,
    )) as OrderWithClient;

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.approve();

    await this.orderRepository.save(order);

    if (order.client) {
      await this.mailGateway.send({
        to: order.client.email,
        subject: 'Pagamento Aprovado! 🕯️',
        body: `Olá ${order.client.name}, seu pagamento foi confirmado e estamos preparando suas velas!`,
      });
    }

    return order;
  }
}
