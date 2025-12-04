import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductsController } from './controllers/products.controller';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [CreateProductUseCase, ListProductsUseCase],
})
export class HttpModule {}
