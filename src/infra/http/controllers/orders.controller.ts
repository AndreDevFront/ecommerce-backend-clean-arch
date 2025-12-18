import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { PlaceOrderUseCase } from 'src/application/use-cases/place-order.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { OrderPresenter } from '../presenters/order.presenter';
import {
  type CreateOrderDto,
  createOrderSchema,
} from './schemas/create-order.schema';

@Controller('orders')
export class OrdersController {
  constructor(private placeOrderUseCase: PlaceOrderUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async create(@Body() body: CreateOrderDto) {
    const formattedAddress = `${body.address.street}, ${body.address.number} - ${body.address.neighborhood}`;
    const formattedCity = `${body.address.city}/${body.address.state.toUpperCase()}`;

    const result = await this.placeOrderUseCase.execute({
      customerId: undefined,
      customerInfo: {
        name: body.name,
        email: body.email,
        address: formattedAddress,
        city: formattedCity,
        zipCode: body.address.zipCode,
      },
      items: body.items,
      paymentMethod: body.paymentMethod,
    });

    return {
      order: OrderPresenter.toHTTP(result.order),
      payment: result.payment,
    };
  }
}
