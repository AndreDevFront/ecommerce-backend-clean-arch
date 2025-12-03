import { Body, Controller, Post } from '@nestjs/common';
import { CreateProductUseCase } from 'src/application/use-cases/create-product.use-case';

// DTO Temporário (depois validamos com Zod/ClassValidator)
class CreateProductDto {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  attributes: Record<string, any>;
}

@Controller('products')
export class ProductsController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Post()
  async create(@Body() body: CreateProductDto) {
    // Chama o UseCase passando os dados
    const product = await this.createProductUseCase.execute({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      stock: body.stock,
      attributes: body.attributes,
    });

    // Retorna um objeto simples por enquanto
    return { product };
  }
}
