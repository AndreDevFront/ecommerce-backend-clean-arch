import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetStoreConfigUseCase } from 'src/application/use-cases/get-store-config.use-case';
import { UpdateStoreConfigUseCase } from 'src/application/use-cases/update-store-config.use-case';
import { StoreConfigRepository } from 'src/domain/repositories/store-config-repository.interface';
import { DatabaseModule } from 'src/infra/database/database.module';
import { StoreConfigSchema } from 'src/infra/database/typeorm/entities/store-config.schema';
import { TypeOrmStoreConfigRepository } from 'src/infra/database/typeorm/repositories/typeorm-store-config.repository';
import { StoreConfigController } from '../controllers/store-config.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StoreConfigSchema]), DatabaseModule],
  controllers: [StoreConfigController],
  providers: [
    {
      provide: StoreConfigRepository,
      useClass: TypeOrmStoreConfigRepository,
    },
    UpdateStoreConfigUseCase,
    GetStoreConfigUseCase,
  ],
})
export class StoreConfigModule {}
