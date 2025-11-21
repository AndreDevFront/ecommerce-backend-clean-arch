import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductsService {
  // Injetamos o banco de dados aqui no construtor
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // O Prisma faz o insert no banco
    return await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        slug: createProductDto.slug,
        description: createProductDto.description,
        price: createProductDto.price,
        stock: createProductDto.stock,
        // categoryId: ... (vamos deixar categoria pra depois pra simplificar)
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  // ... pode deixar os outros métodos vazios por enquanto
}
