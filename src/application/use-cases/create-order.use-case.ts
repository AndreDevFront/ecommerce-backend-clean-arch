import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order } from 'src/domain/entities/order.entity';
import { OrderCreatedEvent } from 'src/domain/events/order-created.event';
import { PaymentGateway } from 'src/domain/gateways/payment.gateway';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';

export interface CreateOrderRequest {
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
  paymentMethod: 'pix' | 'card';
}

export interface CreateOrderResponse {
  order: Order;
  payment: {
    transactionId: string;
    status: string;
    clientSecret?: string;
    pixQrCodeUrl?: string;
    pixCopyPaste?: string;
  };
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private userRepository: UserRepository,
    private paymentGateway: PaymentGateway,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    customerId,
    items,
    shippingAddress,
    paymentMethod,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
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
      paymentMethod: paymentMethod,
    });

    await this.orderRepository.create(order);

    const paymentTransaction = await this.paymentGateway.createTransaction({
      orderId: order.id!,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      customerId: customer.id!,
      customerEmail: customer.email,
    });

    this.eventEmitter.emit(
      'order.created',
      new OrderCreatedEvent(
        order.id!,
        customer.email,
        order.total,
        order.paymentMethod,
      ),
    );

    return {
      order,
      payment: {
        transactionId: paymentTransaction.transactionId,
        status: paymentTransaction.status,
        clientSecret: paymentTransaction.clientSecret,
        pixQrCodeUrl: paymentTransaction.pixQrCodeUrl,
        pixCopyPaste: paymentTransaction.pixCopyPaste,
      },
    };
  }
}
