import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/domain/entities/order.entity';
import {
  FindManyRecentProps,
  OrderRepository,
} from 'src/domain/repositories/order-repository.interface';
import { Repository } from 'typeorm';
import { OrderSchema } from '../entities/order.schema';
import { TypeOrmOrderMapper } from '../mappers/typeorm-order.mapper';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderSchema)
    private typeOrmRepo: Repository<OrderSchema>,
  ) {}

  async findManyRecent({ page }: FindManyRecentProps): Promise<Order[]> {
    const orders = await this.typeOrmRepo.find({
      order: { createdAt: 'DESC' },
      take: 20,
      skip: (page - 1) * 20,
      relations: ['items'],
    });

    return orders.map((order) => TypeOrmOrderMapper.toDomain(order));
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.typeOrmRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      return null;
    }

    return TypeOrmOrderMapper.toDomain(order);
  }

  async save(order: Order): Promise<void> {
    const data = TypeOrmOrderMapper.toPersistence(order);
    await this.typeOrmRepo.save(data);
  }

  async create(order: Order): Promise<void> {
    const data = TypeOrmOrderMapper.toPersistence(order);

    const created = this.typeOrmRepo.create(data);

    await this.typeOrmRepo.save(created);
  }
}
