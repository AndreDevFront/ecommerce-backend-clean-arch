import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { ProductSchema } from './typeorm/entities/product.schema';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        url: envService.getDatabaseUrl,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
        entities: [ProductSchema],

        autoLoadEntities: true,
        synchronize: envService.isDevelopment,
      }),
    }),
  ],
})
export class DatabaseModule {}
