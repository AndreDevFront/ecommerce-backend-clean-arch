import { PaginatedResult, PaginationParams } from 'src/core/types/pagination';
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>;
  abstract findBySlug(slug: string): Promise<Product | null>;
  abstract findAll(params: PaginationParams): Promise<PaginatedResult<Product>>;
  abstract findById(id: string): Promise<Product | null>;
  abstract save(product: Product): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findLowStock(limit: number): Promise<Product[]>;
}
