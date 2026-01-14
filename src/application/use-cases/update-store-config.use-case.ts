import { Injectable } from '@nestjs/common';
import {
  BannerItem,
  StoreConfig,
} from 'src/domain/entities/store-config.entity';
import { StoreConfigRepository } from 'src/domain/repositories/store-config-repository.interface';

interface UpdateStoreConfigRequest {
  banners: BannerItem[];
}

@Injectable()
export class UpdateStoreConfigUseCase {
  constructor(private storeConfigRepository: StoreConfigRepository) {}

  async execute({ banners }: UpdateStoreConfigRequest): Promise<StoreConfig> {
    let config = await this.storeConfigRepository.get();

    if (config) {
      config.updateBanners(banners);
    } else {
      config = new StoreConfig({
        banners,
      });
    }

    await this.storeConfigRepository.save(config);

    return config;
  }
}
