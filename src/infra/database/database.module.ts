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
        entities: [ProductSchema, UserSchema],
        synchronize: envService.isDevelopment,
      }),
    }),

    TypeOrmModule.forFeature([ProductSchema, UserSchema]),
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
  ],
  exports: [ProductRepository, UserRepository],
})
export class DatabaseModule {}
