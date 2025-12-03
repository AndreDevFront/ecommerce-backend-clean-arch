import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { ProductSchema } from './typeorm/entities/product.schema';
import { ProductRepository } from 'src/domain/repositories/product-repository.interface';
import { TypeOrmProductRepository } from './typeorm/repositories/typeorm-product.repository';

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
        entities: [ProductSchema],
        synchronize: envService.isDevelopment,
      }),
    }),

    TypeOrmModule.forFeature([ProductSchema]),
  ],
  providers: [
    {
      provide: ProductRepository,
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: [ProductRepository],
})
export class DatabaseModule {}
