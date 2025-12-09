import { Module } from '@nestjs/common';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authenticate-user.use-case';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { CreateUserUseCase } from 'src/application/use-cases/create-user.use-case';
import { DeleteProductUseCase } from 'src/application/use-cases/delete-product.use-case';
import { EditProductUseCase } from 'src/application/use-cases/edit-product.use-case';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';
import { PlaceOrderUseCase } from 'src/application/use-cases/place-order.use-case';
import { UploadImageUseCase } from 'src/application/use-cases/upload-image.use-case';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { OrdersController } from './controllers/orders.controller';
import { ProductsController } from './controllers/products.controller';
import { UploadController } from './controllers/upload.controller';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [
    ProductsController,
    UsersController,
    AuthenticateController,
    OrdersController,
    UploadController,
  ],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    CreateUserUseCase,
    AuthenticateUserUseCase,
    PlaceOrderUseCase,
    EditProductUseCase,
    DeleteProductUseCase,
    UploadImageUseCase,
  ],
})
export class HttpModule {}
