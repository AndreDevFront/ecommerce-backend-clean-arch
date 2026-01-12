import { Injectable } from '@nestjs/common';
import { ConflictException } from 'src/core/exceptions/conflict.exception';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';

interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  attributes?: Record<string, any>;
  images?: string[] | null;
}

@Injectable()
export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(request: CreateProductRequest): Promise<Product> {
    const slugExists = await this.productRepository.findBySlug(request.slug);

    if (slugExists) {
      throw new ConflictException('Product with this slug already exists');
    }

    const product = new Product({
      name: request.name,
      slug: request.slug,
      description: request.description,
      price: request.price,
      stock: request.stock,
      attributes: request.attributes || {},
      isActive: true,
      images: request.images || [],
    });

    await this.productRepository.create(product);

    return product;
  }
}
