import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';

interface ApproveOrderRequest {
  orderId: string;
}

@Injectable()
export class ApproveOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    @InjectQueue('emails') private emailQueue: Queue,
  ) {}

  async execute({ orderId }: ApproveOrderRequest): Promise<Order> {
    console.log(
      `🔍 [DEBUG NUCLEAR] 1. Começando a executar o UseCase para ID: ${orderId}`,
    );

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'PAID') {
      console.log(`🔁 Pedido ${orderId} já processado.`);
      return order;
    }

    order.approve();
    await this.orderRepository.save(order);
    console.log(
      `💾 [DEBUG NUCLEAR] 2. Pedido salvo como PAGO. Agora vou buscar o estoque...`,
    );

    console.log(`📉 [DEBUG NUCLEAR] 3. Entrando no Loop de Itens...`);

    for (const item of order.items) {
      console.log(
        `   > Processando item: ${item.productId} (Qtd: ${item.quantity})`,
      );
      const product = await this.productRepository.findById(item.productId);

      if (product) {
        try {
          const quantityToDecrease = Math.abs(item.quantity);

          console.log(`   > Estoque ANTES: ${product.stock}`);
          product.decreaseStock(quantityToDecrease);

          await this.productRepository.save(product);
          console.log(`✅ [DEBUG NUCLEAR] 4. Estoque DEPOIS: ${product.stock}`);
        } catch (error) {
          console.error(`⚠️ Erro ao baixar estoque:`, error);
        }
      } else {
        console.error(
          `⚠️ Produto não encontrado no banco! ID: ${item.productId}`,
        );
      }
    }

    if (order.customer && order.customer.email) {
      await this.emailQueue.add('send-email', {
        to: order.customer.email,
        subject: 'Pagamento Aprovado! 🕯️',
        body: `Olá ${order.customer.name}, seu pagamento foi confirmado!`,
      });
    }

    return order;
  }
}
