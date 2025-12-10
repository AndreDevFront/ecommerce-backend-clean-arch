import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CancelOrderUseCase } from 'src/application/use-cases/cancel-order.use-case';
import { OrderPresenter } from '../presenters/order.presenter';

@Controller('/orders/:id/cancel')
export class CancelOrderController {
  constructor(private cancelOrder: CancelOrderUseCase) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async handle(@Param('id') id: string) {
    const order = await this.cancelOrder.execute({
      orderId: id,
    });

    return { order: OrderPresenter.toHTTP(order) };
  }
}
