import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './infra/auth/auth.module';
import { HttpModule } from './infra/http/http.module';
import { StoreConfigModule } from './infra/http/modules/store-config.module';
import { InfraModule } from './infra/infra.module';
import { OrderCleanupService } from './infra/jobs/order-cleanup.service';
import { SendOrderEmailListener } from './infra/listeners/send-order-email.listener';
import { MailModule } from './infra/mail/mail.module';
import { PaymentModule } from './infra/payment/payment.module';
import { StorageModule } from './infra/storage/storage.module';
@Module({
  imports: [
    StoreConfigModule,
    InfraModule,
    HttpModule,
    AuthModule,
    StorageModule,
    MailModule,
    PaymentModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
  ],
  providers: [
    SendOrderEmailListener,
    OrderCleanupService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
