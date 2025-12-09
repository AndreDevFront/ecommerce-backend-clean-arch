import { Module } from '@nestjs/common';
import { AuthModule } from './infra/auth/auth.module';
import { HttpModule } from './infra/http/http.module';
import { InfraModule } from './infra/infra.module';
import { StorageModule } from './infra/storage/storage.module';

@Module({
  imports: [InfraModule, HttpModule, AuthModule, StorageModule],
})
export class AppModule {}
