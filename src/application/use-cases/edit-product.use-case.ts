import { Injectable } from '@nestjs/common';
import { ConflictException } from 'src/core/exceptions/conflict.exception';
import { ResourceNotFoundException } from 'src/core/exceptions/resource-not-found.exception';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';

interface EditProductRequest {
  productId: string;
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  stock?: number;
  attributes?: Record<string, any>;
  isActive?: boolean;
  images?: string[];
}

@Injectable()
export class EditProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    productId,
    ...params
  }: EditProductRequest): Promise<Product> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundException('Product not found');
    }

    if (params.slug && params.slug !== product.slug) {
      const productWithSameSlug = await this.productRepository.findBySlug(
        params.slug,
      );

      if (productWithSameSlug) {
        throw new ConflictException('Slug already in use by another product');
      }
    }

    product.update(params);

    await this.productRepository.save(product);

    return product;
  }
}
