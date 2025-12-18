import { Module } from '@nestjs/common';
import { PaymentGateway } from 'src/domain/gateways/payment.gateway';
import { EnvModule } from '../env/env.module';
import { StripeGateway } from './stripe.gateway';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: PaymentGateway,
      useClass: StripeGateway,
    },
  ],
  exports: [PaymentGateway],
})
export class PaymentModule {}
