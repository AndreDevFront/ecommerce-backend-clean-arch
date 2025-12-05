import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProductsController } from './controllers/products.controller';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';
import { CreateUserUseCase } from 'src/application/use-cases/create-user.use-case';
import { UsersController } from './controllers/users.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authenticate-user.use-case';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController, UsersController, AuthenticateController],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    CreateUserUseCase,
    AuthenticateUserUseCase,
  ],
})
export class HttpModule {}
