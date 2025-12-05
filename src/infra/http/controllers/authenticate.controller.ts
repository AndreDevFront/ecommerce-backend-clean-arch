import { Body, Controller, Post, UsePipes, HttpCode } from '@nestjs/common';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authenticate-user.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import { AuthenticateSchema } from './schemas/authenticate.schema';
import type { AuthenticateDto } from './schemas/authenticate.schema';

@Controller('sessions')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(AuthenticateSchema.schema))
  async handle(@Body() body: AuthenticateDto) {
    const { accessToken } = await this.authenticateUser.execute({
      email: body.email,
      password: body.password,
    });

    return { access_token: accessToken };
  }
}
