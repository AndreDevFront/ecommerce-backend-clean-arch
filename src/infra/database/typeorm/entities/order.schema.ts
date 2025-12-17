import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItemSchema } from './order-item.schema';

@Entity({ name: 'orders' })
export class OrderSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  total: number;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ type: 'jsonb' })
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    zipCode: string;
  };

  @OneToMany(() => OrderItemSchema, (item) => item.order, {
    cascade: true,
  })
  items: OrderItemSchema[];

  @Column({ default: 'card' })
  paymentMethod: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
