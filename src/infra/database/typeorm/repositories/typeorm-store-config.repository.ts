import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreConfig } from 'src/domain/entities/store-config.entity';
import { StoreConfigRepository } from 'src/domain/repositories/store-config-repository.interface';
import { Repository } from 'typeorm';
import { StoreConfigSchema } from '../entities/store-config.schema';

@Injectable()
export class TypeOrmStoreConfigRepository implements StoreConfigRepository {
  constructor(
    @InjectRepository(StoreConfigSchema)
    private typeOrmRepository: Repository<StoreConfigSchema>,
  ) {}

  async get(): Promise<StoreConfig | null> {
    const configSchema = await this.typeOrmRepository.findOne({
      where: {},
    });

    if (!configSchema) {
      return null;
    }

    return new StoreConfig({
      id: configSchema.id,
      banners: configSchema.banners,
      updatedAt: configSchema.updated_at,
    });
  }

  async save(storeConfig: StoreConfig): Promise<void> {
    await this.typeOrmRepository.save({
      id: storeConfig.id,
      banners: storeConfig.banners,
      updated_at: storeConfig.updatedAt,
    });
  }
}
