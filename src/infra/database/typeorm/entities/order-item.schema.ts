import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OrderSchema } from './order.schema';
import { ProductSchema } from './product.schema';

@Entity({ name: 'order_items' })
export class OrderItemSchema {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => ProductSchema)
  @JoinColumn({ name: 'productId' })
  product: ProductSchema;

  @Column({ name: 'productId' })
  productId: string;

  @Column()
  productName: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column('int')
  quantity: number;

  @ManyToOne(() => OrderSchema, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderSchema;

  @Column({ name: 'orderId' })
  orderId: string;
}
