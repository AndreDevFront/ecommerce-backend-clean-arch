import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order, OrderStatus } from 'src/domain/entities/order.entity';
import { OrderItemSchema } from '../entities/order-item.schema';
import { OrderSchema } from '../entities/order.schema';

export class TypeOrmOrderMapper {
  static toDomain(raw: OrderSchema): Order {
    console.log(
      '🔍 [MAPPER DEBUG] O que veio do banco:',
      JSON.stringify(raw.customerInfo, null, 2),
    );
    const items = raw.items.map((item) => {
      return new OrderItem({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: Number(item.price),
        quantity: item.quantity,
      });
    });

    return new Order({
      id: raw.id,
      status: raw.status as OrderStatus,
      customerInfo: raw.customerInfo,
      items: items,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      paymentMethod: raw.paymentMethod as 'pix' | 'card',
    });
  }

  static toPersistence(order: Order): OrderSchema {
    const itemsSchema = order.items.map((item) => {
      return {
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
      } as OrderItemSchema;
    });

    return {
      id: order.id,
      total: order.total,
      status: order.status,
      customerInfo: order.customerInfo,
      items: itemsSchema,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      paymentMethod: order.paymentMethod,
    } as OrderSchema;
  }
}
