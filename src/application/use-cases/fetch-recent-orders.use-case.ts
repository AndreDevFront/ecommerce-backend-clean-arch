import { Injectable } from '@nestjs/common';
import { PaginatedResult, PaginationParams } from 'src/core/types/pagination';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

export type FetchRecentOrdersRequest = PaginationParams;

export type FetchRecentOrdersResponse = PaginatedResult<Order>;

@Injectable()
export class FetchRecentOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    page,
    perPage,
  }: FetchRecentOrdersRequest): Promise<FetchRecentOrdersResponse> {
    const result = await this.orderRepository.findManyRecent({
      page,
      perPage,
    });

    return result;
  }
}
