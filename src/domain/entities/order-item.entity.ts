import { randomUUID } from 'crypto';

export type OrderItemProps = {
  id?: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

export class OrderItem {
  private _props: OrderItemProps;

  constructor(props: OrderItemProps) {
    this._props = {
      ...props,
      id: props.id ?? randomUUID(),
    };
  }

  get id() {
    return this._props.id;
  }
  get productId() {
    return this._props.productId;
  }
  get productName() {
    return this._props.productName;
  }
  get price() {
    return this._props.price;
  }
  get quantity() {
    return this._props.quantity;
  }

  get total(): number {
    return this._props.price * this._props.quantity;
  }
}
