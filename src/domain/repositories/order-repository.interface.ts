import { Order } from '../entities/order.entity';

export interface FindManyRecentProps {
  page: number;
}

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract save(order: Order): Promise<void>;
  abstract findManyRecent(params: FindManyRecentProps): Promise<Order[]>;
}
