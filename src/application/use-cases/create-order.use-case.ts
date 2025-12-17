import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order } from 'src/domain/entities/order.entity';
import { OrderCreatedEvent } from 'src/domain/events/order-created.event';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';

interface CreateOrderRequest {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    customerId,
    items,
    shippingAddress,
  }: CreateOrderRequest): Promise<Order> {
    const customer = await this.userRepository.findById(customerId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Product ${product.name} has insufficient stock`,
        );
      }

      orderItems.push(
        new OrderItem({
          productId: product.id!,
          productName: product.name,
          quantity: item.quantity,
          price: product.price,
        }),
      );
    }

    const order = new Order({
      customerId,
      customerInfo: {
        name: customer.name,
        email: customer.email,
        address: shippingAddress.street,
        city: shippingAddress.city,
        zipCode: shippingAddress.zipCode,
      },
      items: orderItems,
      paymentMethod: 'card',
    });

    await this.orderRepository.create(order);

    this.eventEmitter.emit(
      'order.created',
      new OrderCreatedEvent(order.id!, customer.email, order.total),
    );

    return order;
  }
}
