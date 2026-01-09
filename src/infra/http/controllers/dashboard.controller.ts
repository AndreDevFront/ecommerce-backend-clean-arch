import { Controller, Get } from '@nestjs/common';
import { GetDashboardMetricsUseCase } from 'src/application/use-cases/get-dashboard-metrics.use-case';
import { ProductPresenter } from '../presenters/product.presenter';

@Controller('dashboard')
export class DashboardController {
  constructor(private getDashboardMetricsUseCase: GetDashboardMetricsUseCase) {}

  @Get('metrics')
  async handle() {
    const { totalRevenue, totalOrders, lowStockProducts } =
      await this.getDashboardMetricsUseCase.execute();

    return {
      metrics: {
        revenue: totalRevenue,
        orders: totalOrders,
      },

      lowStockProducts: lowStockProducts.map((product) =>
        ProductPresenter.toHTTP(product),
      ),
    };
  }
}
