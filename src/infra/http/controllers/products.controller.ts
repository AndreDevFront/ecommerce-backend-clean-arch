import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import {
  CreateProductSchema,
  type CreateProductDto,
} from './schemas/create-product.schema';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';

@Controller('products')
export class ProductsController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema.schema))
  async create(@Body() body: CreateProductDto) {
    const product = await this.createProductUseCase.execute({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      stock: body.stock,
      attributes: body.attributes,
    });
    return product;
  }
}
