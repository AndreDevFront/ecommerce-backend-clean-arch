import { Injectable } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

interface FetchRecentOrdersRequest {
  page: number;
}

@Injectable()
export class FetchRecentOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({ page }: FetchRecentOrdersRequest): Promise<Order[]> {
    const orders = await this.orderRepository.findManyRecent({ page });

    return orders;
  }
}
