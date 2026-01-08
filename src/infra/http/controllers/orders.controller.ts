import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { FetchRecentOrdersUseCase } from 'src/application/use-cases/fetch-recent-orders.use-case';
import { PlaceOrderUseCase } from 'src/application/use-cases/place-order.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { OrderPresenter } from '../presenters/order.presenter';
import {
  type CreateOrderDto,
  createOrderSchema,
} from './schemas/create-order.schema';

@Controller('orders')
export class OrdersController {
  constructor(
    private placeOrderUseCase: PlaceOrderUseCase,
    private fetchRecentOrdersUseCase: FetchRecentOrdersUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async create(@Body() body: CreateOrderDto) {
    const formattedAddress = `${body.address.street}, ${body.address.number} - ${body.address.neighborhood}`;
    const formattedCity = `${body.address.city}/${body.address.state.toUpperCase()}`;

    const result = await this.placeOrderUseCase.execute({
      name: body.name,
      email: body.email,
      shippingAddress: {
        street: formattedAddress,
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

  @Get()
  async fetchRecentOrders(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
  ) {
    const result = await this.fetchRecentOrdersUseCase.execute({
      page: Number(page),
      perPage: Number(perPage),
    });

    return {
      data: result.data.map((order) => OrderPresenter.toHTTP(order)),
      meta: result.meta,
    };
  }
}
