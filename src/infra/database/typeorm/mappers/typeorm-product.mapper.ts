import { Product } from 'src/domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';

export class TypeOrmProductMapper {
  static toDomain(raw: ProductSchema): Product {
    return new Product({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      price: raw.price,
      stock: raw.stock,
      isActive: raw.isActive,
      attributes: raw.attributes,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      images: raw.images || [],
    });
  }

  static toPersistence(product: Product): ProductSchema {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isActive: product.isActive,
      attributes: product.attributes,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      images: product.images,
    } as ProductSchema;
  }
}
