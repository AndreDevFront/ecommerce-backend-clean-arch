import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { Order } from 'src/domain/entities/order.entity';
import { OrderSchema } from '../entities/order.schema';
import { TypeOrmOrderMapper } from '../mappers/typeorm-order.mapper';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderSchema)
    private typeOrmRepo: Repository<OrderSchema>,
  ) {}

  async create(order: Order): Promise<void> {
    const data = TypeOrmOrderMapper.toPersistence(order);

    const created = this.typeOrmRepo.create(data);

    await this.typeOrmRepo.save(created);
  }
}
