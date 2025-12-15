import { Module } from '@nestjs/common';
import { ApproveOrderUseCase } from 'src/application/use-cases/approve-order.use-case';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authenticate-user.use-case';
import { CancelOrderUseCase } from 'src/application/use-cases/cancel-order.use-case';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.use-case';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import { CreateUserUseCase } from 'src/application/use-cases/create-user.use-case';
import { DeleteProductUseCase } from 'src/application/use-cases/delete-product.use-case';
import { EditProductUseCase } from 'src/application/use-cases/edit-product.use-case';
import { FetchRecentOrdersUseCase } from 'src/application/use-cases/fetch-recent-orders.use-case';
import { GetProductBySlugUseCase } from 'src/application/use-cases/get-product-by-slug.use-case';
import { GetProductUseCase } from 'src/application/use-cases/get-product.use-case';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';
import { UploadImageUseCase } from 'src/application/use-cases/upload-image.use-case';
import { DatabaseModule } from '../database/database.module';
import { SendOrderEmailListener } from '../listeners/send-order-email.listener';
import { MailModule } from '../mail/mail.module';
import { StorageModule } from '../storage/storage.module';
import { ApproveOrderController } from './controllers/approve-order.controller';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CancelOrderController } from './controllers/cancel-order.controller';
import { DeleteProductController } from './controllers/delete-product.controller';
import { FetchRecentOrdersController } from './controllers/fetch-recent-orders.controller';
import { GetProductController } from './controllers/get-product.controller';
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
    ApproveOrderController,
    CancelOrderController,
    FetchRecentOrdersController,
    GetProductController,
    DeleteProductController,
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
    ApproveOrderUseCase,
    CancelOrderUseCase,
    FetchRecentOrdersUseCase,
    GetProductUseCase,
    GetProductBySlugUseCase,
  ],
})
export class HttpModule {}
