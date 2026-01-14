import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetStoreConfigUseCase } from 'src/application/use-cases/get-store-config.use-case';
import { UpdateStoreConfigUseCase } from 'src/application/use-cases/update-store-config.use-case';
import { ZodValidationPipe } from '../pipes/zod-validation-pipe';
import {
  type UpdateStoreConfigDto,
  UpdateStoreConfigSchema,
} from './schemas/update-store-config.schema';

@Controller('store-config')
export class StoreConfigController {
  constructor(
    private getStoreConfig: GetStoreConfigUseCase,
    private updateStoreConfig: UpdateStoreConfigUseCase,
  ) {}

  @Get()
  async get() {
    const config = await this.getStoreConfig.execute();
    return { config: config?.toJSON() ?? null };
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ZodValidationPipe(UpdateStoreConfigSchema.schema))
  async update(@Body() body: UpdateStoreConfigDto) {
    const config = await this.updateStoreConfig.execute({
      banners: body.banners,
    });

    return { config: config.toJSON() };
  }
}
