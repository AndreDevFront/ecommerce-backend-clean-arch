import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResult, PaginationParams } from 'src/core/types/pagination';
import { Product } from 'src/domain/entities/product.entity';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { LessThan, Repository } from 'typeorm';
import { ProductSchema } from '../entities/product.schema';
import { TypeOrmProductMapper } from '../mappers/typeorm-product.mapper';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private typeOrmRepo: Repository<ProductSchema>,
  ) {}

  async delete(id: string): Promise<void> {
    await this.typeOrmRepo.delete(id);
  }

  async findAll({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResult<Product>> {
    const [productsSchema, total] = await this.typeOrmRepo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      order: { createdAt: 'DESC' },
    });

    return {
      data: productsSchema.map((item) => TypeOrmProductMapper.toDomain(item)),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

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

  async save(product: Product): Promise<void> {
    const data = TypeOrmProductMapper.toPersistence(product);
    await this.typeOrmRepo.save(data);
  }

  async findById(id: string): Promise<Product | null> {
    const found = await this.typeOrmRepo.findOne({
      where: { id },
    });

    if (!found) {
      return null;
    }

    return TypeOrmProductMapper.toDomain(found);
  }

  async findLowStock(limit: number): Promise<Product[]> {
    const products = await this.typeOrmRepo.find({
      where: {
        stock: LessThan(limit),
      },
      take: 5,
      order: {
        stock: 'ASC',
      },
    });

    return products as unknown as Product[];
  }
}
