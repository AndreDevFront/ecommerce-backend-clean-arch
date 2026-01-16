import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthenticateUserUseCase } from 'src/application/use-cases/authenticate-user.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import type { AuthenticateDto } from './schemas/authenticate.schema';
import { AuthenticateSchema } from './schemas/authenticate.schema';

@Controller('sessions')
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UsePipes(new ZodValidationPipe(AuthenticateSchema.schema))
  async handle(@Body() body: AuthenticateDto) {
    const { accessToken } = await this.authenticateUser.execute({
      email: body.email,
      password: body.password,
    });

    return { access_token: accessToken };
  }
}
