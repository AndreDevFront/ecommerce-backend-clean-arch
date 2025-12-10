import { Controller, Get, Param } from '@nestjs/common';
import { GetProductUseCase } from 'src/application/use-cases/get-product.use-case';
import { ProductPresenter } from '../presenters/product.presenter';

@Controller('/products/:id')
export class GetProductController {
  constructor(private getProduct: GetProductUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const product = await this.getProduct.execute({
      productId: id,
    });

    return { product: ProductPresenter.toHTTP(product) };
  }
}
