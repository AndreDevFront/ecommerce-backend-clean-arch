import { Order } from 'src/domain/entities/order.entity';
import { OrderItem } from 'src/domain/entities/order-item.entity';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      customer: order.customerInfo,
      items: order.items.map((item) => OrderPresenter.toHTTPItem(item)),
      createdAt: order.createdAt,
    };
  }

  private static toHTTPItem(item: OrderItem) {
    return {
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      quantity: item.quantity,
      total: item.total,
    };
  }
}
