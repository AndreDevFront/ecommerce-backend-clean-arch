import { Injectable } from '@nestjs/common';
import { ResourceNotFoundException } from 'src/core/exceptions/resource-not-found.exception';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';

interface Request {
  slug: string;
}

@Injectable()
export class GetProductBySlugUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({ slug }: Request): Promise<Product> {
    const product = await this.productRepository.findBySlug(slug);

    if (!product) {
      throw new ResourceNotFoundException('Product not found');
    }

    return product;
  }
}
