import { Module } from '@nestjs/common';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authenticate-user.use-case';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.use-case';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { CreateUserUseCase } from 'src/application/use-cases/create-user.use-case';
import { DeleteProductUseCase } from 'src/application/use-cases/delete-product.use-case';
import { EditProductUseCase } from 'src/application/use-cases/edit-product.use-case';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';
import { UploadImageUseCase } from 'src/application/use-cases/upload-image.use-case';
import { DatabaseModule } from '../database/database.module';
import { SendOrderEmailListener } from '../listeners/send-order-email.listener';
import { MailModule } from '../mail/mail.module';
import { StorageModule } from '../storage/storage.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { OrdersController } from './controllers/orders.controller';
import { ProductsController } from './controllers/products.controller';
import { UploadController } from './controllers/upload.controller';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [DatabaseModule, StorageModule, MailModule],
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
    CreateOrderUseCase,
    EditProductUseCase,
    DeleteProductUseCase,
    UploadImageUseCase,
    SendOrderEmailListener,
  ],
})
export class HttpModule {}
