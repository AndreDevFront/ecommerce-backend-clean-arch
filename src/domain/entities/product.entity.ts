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

  public decreaseStock(quantity: number) {
    if (this._props.stock < quantity) {
      throw new Error('Insufficient stock');
    }
    this._props.stock -= quantity;
  }
}
