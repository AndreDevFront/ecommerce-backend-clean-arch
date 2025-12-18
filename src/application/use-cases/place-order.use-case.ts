import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { Order } from 'src/domain/entities/order.entity';
import { PaymentGateway } from 'src/domain/gateways/payment.gateway';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';

interface PlaceOrderRequest {
  customerId?: string;
  customerInfo: {
    name: string;
    email: string;
    address: string;
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
    private userRepository: UserRepository,
    private paymentGateway: PaymentGateway,
  ) {}

  async execute({
    customerId,
    customerInfo,
    items,
    paymentMethod,
  }: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    if (customerId) {
      const customer = await this.userRepository.findById(customerId);
      if (!customer) throw new NotFoundException('Customer not found');
    }

    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
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
      customerId: customerId,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        zipCode: customerInfo.zipCode,
      },
      items: orderItems,
      paymentMethod: paymentMethod,
    });

    await this.orderRepository.create(order);

    const paymentTransaction = await this.paymentGateway.createTransaction({
      orderId: order.id!,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      customerId: customerId ?? 'guest',
      customerEmail: customerInfo.email,
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
