import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

interface ApproveOrderRequest {
  orderId: string;
}

@Injectable()
export class ApproveOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ orderId }: ApproveOrderRequest): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.approve();

    await this.orderRepository.save(order);

    return order;
  }
}
