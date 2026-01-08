import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order } from 'src/domain/entities/order.entity';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id,
      status: order.status,
      total: order.total,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        street: order.customer.address,
        number: 'S/N',
        complement: '',
        neighborhood: '',
        city: order.customer.city,
        state: '',
        zipCode: order.customer.zipCode,
      },
      items: order.items.map((item) => OrderPresenter.toHTTPItem(item)),
      createdAt: order.createdAt,
      paymentMethod: order.paymentMethod,
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
