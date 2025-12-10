import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteProductUseCase } from 'src/application/use-cases/delete-product.use-case';

@Controller('/products/:id')
export class DeleteProductController {
  constructor(private deleteProduct: DeleteProductUseCase) {}

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    await this.deleteProduct.execute({
      productId: id,
    });
  }
}
