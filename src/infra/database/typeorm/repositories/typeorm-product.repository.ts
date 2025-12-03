import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { Product } from 'src/domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';
import { TypeOrmProductMapper } from '../mappers/typeorm-product.mapper';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private typeOrmRepo: Repository<ProductSchema>,
  ) {}

  async create(product: Product): Promise<void> {
    const data = TypeOrmProductMapper.toPersistence(product);
    const created = this.typeOrmRepo.create(data);
    await this.typeOrmRepo.save(created);
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const found = await this.typeOrmRepo.findOne({
      where: { slug },
    });

    if (!found) {
      return null;
    }

    return TypeOrmProductMapper.toDomain(found);
  }
}
