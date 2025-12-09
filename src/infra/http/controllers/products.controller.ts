import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';

import { DeleteProductUseCase } from 'src/application/use-cases/delete-product.use-case';

import { EditProductUseCase } from 'src/application/use-cases/edit-product.use-case';
import { ListProductsUseCase } from 'src/application/use-cases/list-products.use-case';

import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  CreateProductSchema,
  type CreateProductDto,
} from './schemas/create-product.schema';
import {
  EditProductSchema,
  type EditProductDto,
} from './schemas/edit-product.schema';
import {
  ListProductsSchema,
  type ListProductsDto,
} from './schemas/list-products.schema';

@Controller('products')
export class ProductsController {
  constructor(
    private createProductUseCase: CreateProductUseCase,
    private listProductsUseCase: ListProductsUseCase,
    private editProductUseCase: EditProductUseCase,
    private deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ZodValidationPipe(CreateProductSchema.schema))
  async create(@Body() body: CreateProductDto) {
    const product = await this.createProductUseCase.execute({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      stock: body.stock,
      attributes: body.attributes,
      image: body.image,
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

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ZodValidationPipe(EditProductSchema.schema))
  async update(@Param('id') id: string, @Body() body: EditProductDto) {
    const product = await this.editProductUseCase.execute({
      productId: id,
      ...body,
    });

    return { product };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.deleteProductUseCase.execute({
      productId: id,
    });
  }
}
