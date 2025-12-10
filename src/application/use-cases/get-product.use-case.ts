import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';

interface GetProductRequest {
  productId: string;
}

@Injectable()
export class GetProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({ productId }: GetProductRequest): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
