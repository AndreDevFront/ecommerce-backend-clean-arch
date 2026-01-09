import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';

@Injectable()
export class OrderCleanupService {
  private readonly logger = new Logger(OrderCleanupService.name);

  constructor(private orderRepository: OrderRepository) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
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
