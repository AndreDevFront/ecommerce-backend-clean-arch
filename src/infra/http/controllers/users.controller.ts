import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserUseCase } from 'src/application/use-cases/create-user.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { CreateUserSchema } from './schemas/create-user.schema';
import type { CreateUserDto } from './schemas/create-user.schema'; // Import type!
import { UserPresenter } from '../presenters/user.presenter';

@Controller('users')
export class UsersController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema.schema))
  async create(@Body() body: CreateUserDto) {
    const user = await this.createUserUseCase.execute({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return { user: UserPresenter.toHTTP(user) };
  }
}
