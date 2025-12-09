import { Module } from '@nestjs/common';
import { StorageGateway } from 'src/domain/gateways/storage.gateway';
import { EnvModule } from '../env/env.module';
import { R2StorageGateway } from './r2-storage.gateway';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: StorageGateway,
      useClass: R2StorageGateway,
    },
  ],
  exports: [StorageGateway],
})
export class StorageModule {}
