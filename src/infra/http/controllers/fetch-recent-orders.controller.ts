import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FetchRecentOrdersUseCase } from 'src/application/use-cases/fetch-recent-orders.use-case';
import { ZodValidationPipe } from 'src/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { OrderPresenter } from '../presenters/order.presenter';

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1));

const perPageQueryParamSchema = z
  .string()
  .optional()
  .default('10')
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);
const perPageValidationPipe = new ZodValidationPipe(perPageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller('/orders')
export class FetchRecentOrdersController {
  constructor(private fetchRecentOrders: FetchRecentOrdersUseCase) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Query('perPage', perPageValidationPipe) perPage: number,
  ) {
    const result = await this.fetchRecentOrders.execute({
      page,
      perPage,
    });

    return {
      orders: result.data.map((order) => OrderPresenter.toHTTP(order)),
      meta: result.meta,
    };
  }
}
