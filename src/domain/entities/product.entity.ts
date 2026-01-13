import { randomUUID } from 'crypto';

export type ProductProps = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
  attributes: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
  images?: string[];
};

export class Product {
  private _props: ProductProps;

  constructor(props: ProductProps) {
    this._props = {
      ...props,
      id: props.id ?? randomUUID(),
      isActive: props.isActive ?? true,
      attributes: props.attributes ?? {},
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
      images: props.images ?? [],
    };
  }

  get id() {
    return this._props.id;
  }
  get name() {
    return this._props.name;
  }
  get slug() {
    return this._props.slug;
  }
  get description() {
    return this._props.description;
  }
  get price() {
    return this._props.price;
  }
  get stock() {
    return this._props.stock;
  }
  get isActive() {
    return this._props.isActive;
  }
  get attributes() {
    return this._props.attributes;
  }
  get createdAt() {
    return this._props.createdAt;
  }
  get updatedAt() {
    return this._props.updatedAt;
  }

  public decreaseStock(quantity: number) {
    if (this._props.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this._props.stock -= quantity;
  }

  public increaseStock(quantity: number) {
    this._props.stock += quantity;
    this.update({});
  }

  public update(
    params: Partial<Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>>,
  ) {
    Object.assign(this._props, params);

    this._props.updatedAt = new Date();
  }

  get images() {
    return this._props.images;
  }

  get image() {
    return this._props.images && this._props.images.length > 0
      ? this._props.images[0]
      : null;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      price: this.price,
      stock: this.stock,
      isActive: this.isActive,
      attributes: this.attributes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      images: this.images,
      image: this.image,
    };
  }
}
