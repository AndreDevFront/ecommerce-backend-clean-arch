import { Injectable } from '@nestjs/common';
import { Product } from 'src/domain/entities/product.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';

interface GetDashboardMetricsResponse {
  totalRevenue: number;
  totalOrders: number;
  lowStockProducts: Product[];
}

@Injectable()
export class GetDashboardMetricsUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  async execute(): Promise<GetDashboardMetricsResponse> {
    const [totalRevenue, totalOrders, lowStockProducts] = await Promise.all([
      this.orderRepository.calculateTotalRevenue(),
      this.orderRepository.countPaidOrders(),
      this.productRepository.findLowStock(5),
    ]);

    return {
      totalRevenue,
      totalOrders,
      lowStockProducts,
    };
  }
}
