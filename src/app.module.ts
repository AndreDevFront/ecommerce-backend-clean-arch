import { Module } from '@nestjs/common';
import { InfraModule } from './infra/infra.module';
import { HttpModule } from './infra/http/http.module';
import { AuthModule } from './infra/auth/auth.module';

@Module({
  imports: [InfraModule, HttpModule, AuthModule],
})
export class AppModule {}
