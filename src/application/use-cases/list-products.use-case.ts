import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { PaginatedResult, PaginationParams } from 'src/core/types/pagination';
import { Product } from 'src/domain/entities/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResult<Product>> {
    return this.productRepository.findAll(params);
  }
}
