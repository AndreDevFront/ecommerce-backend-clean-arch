import { Injectable } from '@nestjs/common';
import { StoreConfig } from 'src/domain/entities/store-config.entity';
import { StoreConfigRepository } from 'src/domain/repositories/store-config-repository.interface';

@Injectable()
export class GetStoreConfigUseCase {
  constructor(private storeConfigRepository: StoreConfigRepository) {}

  async execute(): Promise<StoreConfig | null> {
    return this.storeConfigRepository.get();
  }
}
