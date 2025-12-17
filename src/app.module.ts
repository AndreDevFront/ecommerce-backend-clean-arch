import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './infra/auth/auth.module';
import { HttpModule } from './infra/http/http.module';
import { InfraModule } from './infra/infra.module';
import { SendOrderEmailListener } from './infra/listeners/send-order-email.listener';
import { MailModule } from './infra/mail/mail.module';
import { StorageModule } from './infra/storage/storage.module';

@Module({
  imports: [
    InfraModule,
    HttpModule,
    AuthModule,
    StorageModule,
    MailModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [SendOrderEmailListener],
})
export class AppModule {}
