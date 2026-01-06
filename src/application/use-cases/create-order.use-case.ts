import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order } from 'src/domain/entities/order.entity';
import { OrderCreatedEvent } from 'src/domain/events/order-created.event';
import { PaymentGateway } from 'src/domain/gateways/payment.gateway';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { Customer } from 'src/domain/value-objects/customer.vo';

export interface CreateOrderRequest {
  name: string;
  email: string;
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
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
    private paymentGateway: PaymentGateway,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({
    name,
    email,
    items,
    shippingAddress,
    paymentMethod,
  }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const customer = new Customer(
      name,
      email,
      shippingAddress.street,
      shippingAddress.city,
      shippingAddress.zipCode,
    );

    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new BadRequestException(
          `Produto ${item.productId} não encontrado`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Produto ${product.name} sem estoque`);
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
      customer: customer,
      items: orderItems,
      paymentMethod: paymentMethod,
    });

    await this.orderRepository.create(order);

    const paymentTransaction = await this.paymentGateway.createTransaction({
      orderId: order.id!,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      customerId: order.id!,
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
