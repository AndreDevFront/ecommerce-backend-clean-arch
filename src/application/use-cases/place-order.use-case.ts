import { Injectable, BadRequestException } from '@nestjs/common';
import { Order } from 'src/domain/entities/order.entity';
import { OrderItem } from 'src/domain/entities/order-item.entity';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ResourceNotFoundException } from 'src/core/exceptions/resource-not-found.exception';

export interface PlaceOrderInput {
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
}

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute(input: PlaceOrderInput): Promise<Order> {
    const orderItems: OrderItem[] = [];

    for (const itemInput of input.items) {
      const product = await this.productRepository.findById(
        itemInput.productId,
      );

      if (!product) {
        throw new ResourceNotFoundException(
          `Product ID ${itemInput.productId} not found`,
        );
      }

      if (product.stock < itemInput.quantity) {
        throw new BadRequestException(
          `Product '${product.name}' has insufficient stock. Requested: ${itemInput.quantity}, Available: ${product.stock}`,
        );
      }

      product.decreaseStock(itemInput.quantity);

      await this.productRepository.save(product);

      const orderItem = new OrderItem({
        productId: product.id!,
        productName: product.name,
        price: product.price,
        quantity: itemInput.quantity,
      });

      orderItems.push(orderItem);
    }

    const order = new Order({
      customerId: input.customerId,
      customerInfo: input.customerInfo,
      items: orderItems,
    });

    await this.orderRepository.create(order);

    return order;
  }
}
