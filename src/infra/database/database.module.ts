import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { ProductSchema } from './typeorm/entities/product.schema';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { TypeOrmProductRepository } from './typeorm/repositories/typeorm-product.repository';
import { UserSchema } from './typeorm/entities/user.schema';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';
import { TypeOrmUserRepository } from './typeorm/repositories/typeorm-user.repository';
import { OrderItemSchema } from './typeorm/entities/order-item.schema';
import { OrderSchema } from './typeorm/entities/order.schema';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { TypeOrmOrderRepository } from './typeorm/repositories/typeorm-order.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        url: envService.getDatabaseUrl,
        ssl: true,
        extra: { ssl: { rejectUnauthorized: false } },
        entities: [ProductSchema, UserSchema, OrderSchema, OrderItemSchema],
        synchronize: envService.isDevelopment,
      }),
    }),

    TypeOrmModule.forFeature([
      ProductSchema,
      UserSchema,
      OrderSchema,
      OrderItemSchema,
    ]),
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: TypeOrmProductRepository,
    },
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: OrderRepository,
      useClass: TypeOrmOrderRepository,
    },
  ],
  exports: [ProductRepository, UserRepository, OrderRepository],
})
export class DatabaseModule {}
