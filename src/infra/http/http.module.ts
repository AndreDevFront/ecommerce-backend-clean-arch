import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductsController } from './controllers/products.controller';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';
import { CreateUserUseCase } from 'src/application/use-cases/create-user.use-case';
import { UsersController } from './controllers/users.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authenticate-user.use-case';
import { PlaceOrderUseCase } from 'src/application/use-cases/place-order.use-case';
import { OrdersController } from './controllers/orders.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    ProductsController,
    UsersController,
    AuthenticateController,
    OrdersController,
  ],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    CreateUserUseCase,
    AuthenticateUserUseCase,
    PlaceOrderUseCase,
  ],
})
export class HttpModule {}
