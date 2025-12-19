import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order } from 'src/domain/entities/order.entity';
import { PaymentGateway } from 'src/domain/gateways/payment.gateway';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { Customer } from 'src/domain/value-objects/customer.vo';

export interface PlaceOrderRequest {
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

interface PlaceOrderResponse {
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
export class PlaceOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private paymentGateway: PaymentGateway,
  ) {}

  async execute({
    name,
    email,
    shippingAddress,
    items,
    paymentMethod,
  }: PlaceOrderRequest): Promise<PlaceOrderResponse> {
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
