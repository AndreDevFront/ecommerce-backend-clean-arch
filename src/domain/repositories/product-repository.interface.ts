import { PaginatedResult, PaginationParams } from 'src/core/types/pagination';
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>;
  abstract findBySlug(slug: string): Promise<Product | null>;
  abstract findAll(params: PaginationParams): Promise<PaginatedResult<Product>>;
}
