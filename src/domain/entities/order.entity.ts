import { randomUUID } from 'crypto';
import { Customer } from '../value-objects/customer.vo';
import { OrderItem } from './order-item.entity';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELED';

export type OrderProps = {
  id?: string;
  customer: Customer;
  items: OrderItem[];
  status?: OrderStatus;
  paymentMethod: 'card' | 'pix';
  createdAt?: Date;
  updatedAt?: Date;
};

export class Order {
  private _props: OrderProps;

  constructor(props: OrderProps) {
    this._props = {
      ...props,
      id: props.id ?? randomUUID(),
      status: props.status ?? 'PENDING',
      paymentMethod: props.paymentMethod ?? 'card',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this._props.id;
  }
  get items() {
    return this._props.items;
  }
  get customer(): Customer {
    return this._props.customer;
  }
  get status() {
    return this._props.status;
  }
  get createdAt() {
    return this._props.createdAt;
  }

  get updatedAt() {
    return this._props.updatedAt;
  }

  get total(): number {
    return this._props.items.reduce((sum, item) => sum + item.total, 0);
  }

  public addItem(item: OrderItem) {
    this._props.items.push(item);
  }

  public markAsPaid() {
    this._props.status = 'PAID';
    this._props.updatedAt = new Date();
  }

  public approve() {
    this._props.status = 'PAID';
    this._props.updatedAt = new Date();
  }

  public cancel() {
    this._props.status = 'CANCELED';
    this._props.updatedAt = new Date();
  }

  get paymentMethod(): 'card' | 'pix' {
    return this._props.paymentMethod;
  }
}
