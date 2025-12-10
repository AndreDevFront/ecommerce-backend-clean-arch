import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApproveOrderUseCase } from 'src/application/use-cases/approve-order.use-case';
import { OrderPresenter } from '../presenters/order.presenter';

@Controller('/orders/:id/approve')
export class ApproveOrderController {
  constructor(private approveOrder: ApproveOrderUseCase) {}

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  async handle(@Param('id') id: string) {
    const order = await this.approveOrder.execute({
      orderId: id,
    });

    return { order: OrderPresenter.toHTTP(order) };
  }
}
