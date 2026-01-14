import { StoreConfig } from '../entities/store-config.entity';

export abstract class StoreConfigRepository {
  abstract get(): Promise<StoreConfig | null>;
  abstract save(storeConfig: StoreConfig): Promise<void>;
}
