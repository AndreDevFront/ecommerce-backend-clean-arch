import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { PlaceOrderUseCase } from 'src/application/use-cases/place-order.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { PlaceOrderSchema } from './schemas/place-order.schema';
import type { PlaceOrderDto } from './schemas/place-order.schema';
import { OrderPresenter } from '../presenters/order.presenter';

@Controller('orders')
export class OrdersController {
  constructor(private placeOrderUseCase: PlaceOrderUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(PlaceOrderSchema.schema))
  async create(@Body() body: PlaceOrderDto) {
    const order = await this.placeOrderUseCase.execute({
      customerInfo: body.customerInfo,
      items: body.items,
    });

    return { order: OrderPresenter.toHTTP(order) };
  }
}
