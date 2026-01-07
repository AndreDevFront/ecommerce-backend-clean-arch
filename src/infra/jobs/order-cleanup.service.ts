import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';

@Injectable()
export class OrderCleanupService {
  private readonly logger = new Logger(OrderCleanupService.name);

  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
  ) {}

  // @Cron(CronExpression.EVERY_5_MINUTES)
  @Cron('*/10 * * * * *')
  async handleCron() {
    this.logger.debug('🧹 Verificando pedidos expirados...');

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() - 1);

    const expiredOrders =
      await this.orderRepository.findPendingOlderThan(expirationTime);

    if (expiredOrders.length === 0) {
      return;
    }

    this.logger.log(
      `🧹 Encontrados ${expiredOrders.length} pedidos pendentes antigos.`,
    );

    for (const order of expiredOrders) {
      try {
        for (const item of order.items) {
          const product = await this.productRepository.findById(item.productId);

          if (product) {
            product.increaseStock(item.quantity);
            await this.productRepository.save(product);

            this.logger.log(
              `🔄 Estoque devolvido: +${item.quantity} para o produto "${product.name}"`,
            );
          }
        }

        order.cancel();

        await this.orderRepository.save(order);

        this.logger.log(
          `🚫 Pedido ${order.id} cancelado automaticamente por inatividade.`,
        );
      } catch (error) {
        this.logger.error(`❌ Erro ao limpar pedido ${order.id}`, error);
      }
    }
  }
}
