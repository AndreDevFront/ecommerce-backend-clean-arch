import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateOrderUseCase } from 'src/application/use-cases/create-order.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { OrderPresenter } from '../presenters/order.presenter';
import {
  type PlaceOrderDto,
  PlaceOrderSchema,
} from './schemas/place-order.schema';

interface AuthenticatedRequest {
  user: {
    sub: string;
  };
}

@Controller('orders')
export class OrdersController {
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ZodValidationPipe(PlaceOrderSchema.schema))
  async create(@Body() body: PlaceOrderDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.sub;

    const order = await this.createOrderUseCase.execute({
      customerId: userId,
      items: body.items,
      shippingAddress: body.shippingAddress,
    });

    return { order: OrderPresenter.toHTTP(order) };
  }
}
