import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { HttpModule } from './infra/http/http.module';

@Module({
  imports: [InfraModule, HttpModule],
})
export class AppModule {}
