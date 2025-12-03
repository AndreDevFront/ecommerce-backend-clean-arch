import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductsController } from './controllers/products.controller';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';

@Module({
  imports: [
    DatabaseModule, // <--- Isso traz o repositório concreto (TypeOrm)
  ],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase, // <--- O Nest vai injetar o repositório aqui dentro
  ],
})
export class HttpModule {}
