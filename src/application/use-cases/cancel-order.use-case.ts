import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

interface CancelOrderRequest {
  orderId: string;
}

@Injectable()
export class CancelOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId }: CancelOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.cancel();

    await this.orderRepository.save(order);

    return order;
  }
}
