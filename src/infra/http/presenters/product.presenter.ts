import { Product } from 'src/domain/entities/product.entity';

export class ProductPresenter {
  static toHTTP(product: Product) {
    const {
      image,
      isActive,
      attributes,
      name,
      slug,
      description,
      price,
      stock,
      createdAt,
    } = product;

    return {
      id: product.id!.toString(),
      name,
      slug,
      description,
      price,
      stock,
      isActive,
      attributes,
      imageUrl: image ? `${image}` : null,
      images: product.images,
      createdAt,
    };
  }
}
