import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedResult, PaginationParams } from 'src/core/types/pagination';
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { LessThan, Repository } from 'typeorm';
import { OrderSchema } from '../entities/order.schema';
import { TypeOrmOrderMapper } from '../mappers/typeorm-order.mapper';

@Injectable()
export class TypeOrmOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderSchema)
    private typeOrmRepo: Repository<OrderSchema>,
  ) {}

  async findManyRecent({
    page,
    perPage,
  }: PaginationParams): Promise<PaginatedResult<Order>> {
    const [orders, total] = await this.typeOrmRepo.findAndCount({
      skip: (page - 1) * perPage,
      take: perPage,
      order: { createdAt: 'DESC' },
      relations: ['items'],
    });

    return {
      data: orders.map((item) => TypeOrmOrderMapper.toDomain(item)),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
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

  async findPendingOlderThan(date: Date): Promise<Order[]> {
    const orders = await this.typeOrmRepo.find({
      where: {
        status: 'PENDING',
        createdAt: LessThan(date),
      },
      relations: ['items'],
    });

    return orders.map((order) => TypeOrmOrderMapper.toDomain(order));
  }

  async calculateTotalRevenue(): Promise<number> {
    const result = await this.typeOrmRepo
      .createQueryBuilder('order')
      .where('order.status = :status', { status: 'PAID' })
      .select('SUM(order.total)', 'sum')
      .getRawOne<{ sum: string }>();
    return Number(result?.sum) || 0;
  }

  async countPaidOrders(): Promise<number> {
    return this.typeOrmRepo.count({
      where: {
        status: 'PAID',
      },
    });
  }
}
