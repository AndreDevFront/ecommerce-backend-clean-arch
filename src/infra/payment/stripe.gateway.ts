import { Injectable } from '@nestjs/common';
import {
  PaymentGateway,
  PaymentInput,
  PaymentOutput,
} from 'src/domain/gateways/payment.gateway';
import Stripe from 'stripe';
import { EnvService } from '../env/env.service';

@Injectable()
export class StripeGateway implements PaymentGateway {
  private stripe: Stripe;

  constructor(private readonly env: EnvService) {
    this.stripe = new Stripe(env.getStripeSecretKey, {
      apiVersion: '2025-12-15.clover',
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  async createTransaction({
    amount,
    paymentMethod,
    orderId,
    customerEmail,
  }: PaymentInput): Promise<PaymentOutput> {
    const methodType = paymentMethod === 'pix' ? 'pix' : 'card';

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(amount * 100),
      currency: 'brl',
      payment_method_types: [methodType],
      metadata: {
        orderId: orderId,
      },
      receipt_email: customerEmail,
    };

    if (paymentMethod === 'pix') {
      paymentIntentParams.payment_method_options = {
        pix: { expires_after_seconds: 3600 },
      };
    }

    try {
      const intent =
        await this.stripe.paymentIntents.create(paymentIntentParams);

      const output: PaymentOutput = {
        transactionId: intent.id,
        status: intent.status,
        clientSecret: intent.client_secret ?? undefined,
      };

      return output;
    } catch (error) {
      console.error('Erro ao criar transação na Stripe:', error);
      throw new Error('Falha no processamento do pagamento');
    }
  }
}
