import {
  BadRequestException,
  Controller,
  Headers,
  Post,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';

import type { Request } from 'express';
import { ApproveOrderUseCase } from 'src/application/use-cases/approve-order.use-case';
import { EnvService } from 'src/infra/env/env.service';
import Stripe from 'stripe';

@Controller('webhook')
export class WebhookController {
  private stripe: Stripe;

  constructor(
    private env: EnvService,
    private approveOrder: ApproveOrderUseCase,
  ) {
    this.stripe = new Stripe(env.getStripeSecretKey, {
      apiVersion: '2025-12-15.clover',
    });
  }

  @Post()
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    if (!request.rawBody) {
      throw new BadRequestException('Invalid payload: No raw body found');
    }

    const webhookSecret = this.env.getStripeWebhookSecret;

    if (!webhookSecret) {
      throw new Error('Stripe Webhook Secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        request.rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook Error: ${errorMessage}`);
      throw new BadRequestException(`Webhook Error: ${errorMessage}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;

      const { orderId } = paymentIntent.metadata;

      if (orderId) {
        console.log(`💰 Webhook: Aprovando pedido ${orderId}`);

        await this.approveOrder.execute({
          orderId,
        });
      } else {
        console.warn('⚠️ Pagamento recebido sem orderId no metadata');
      }
    }

    return { received: true };
  }
}
