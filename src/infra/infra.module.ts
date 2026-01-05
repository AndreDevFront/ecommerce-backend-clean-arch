import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { EnvModule } from './env/env.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [EnvModule, DatabaseModule, MessagingModule],
  exports: [EnvModule, DatabaseModule, MessagingModule],
})
export class InfraModule {}
