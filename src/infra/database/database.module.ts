import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from 'src/domain/repositories/order-repository.interface';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { UserRepository } from 'src/domain/repositories/user-repository.interface';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { OrderItemSchema } from './typeorm/entities/order-item.schema';
import { OrderSchema } from './typeorm/entities/order.schema';
import { ProductSchema } from './typeorm/entities/product.schema';
import { StoreConfigSchema } from './typeorm/entities/store-config.schema';
import { UserSchema } from './typeorm/entities/user.schema';
import { TypeOrmOrderRepository } from './typeorm/repositories/typeorm-order.repository';
import { TypeOrmProductRepository } from './typeorm/repositories/typeorm-product.repository';
import { TypeOrmUserRepository } from './typeorm/repositories/typeorm-user.repository';

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
        entities: [
          ProductSchema,
          UserSchema,
          OrderSchema,
          OrderItemSchema,
          StoreConfigSchema,
        ],
        // synchronize: envService.isDevelopment,
        synchronize: true,
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
