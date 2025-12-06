import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { ResourceNotFoundException } from 'src/core/exceptions/resource-not-found.exception';

interface DeleteProductRequest {
  productId: string;
}

@Injectable()
export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({ productId }: DeleteProductRequest): Promise<void> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ResourceNotFoundException('Product not found');
    }

    await this.productRepository.delete(productId);
  }
}
