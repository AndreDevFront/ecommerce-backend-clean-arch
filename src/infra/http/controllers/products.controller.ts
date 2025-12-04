import { Body, Controller, Get, Post, Query, UsePipes } from '@nestjs/common';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';
import {
  CreateProductSchema,
  type CreateProductDto,
} from './schemas/create-product.schema';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  type ListProductsDto,
  ListProductsSchema,
} from './schemas/list-products.schema';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';

@Controller('products')
export class ProductsController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
  ) {}

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

  @Get()
  @UsePipes(new ZodValidationPipe(ListProductsSchema.schema))
  async list(@Query() query: ListProductsDto) {
    const result = await this.listProductsUseCase.execute({
      page: query.page,
      perPage: query.perPage,
    });

    return result;
  }
}
