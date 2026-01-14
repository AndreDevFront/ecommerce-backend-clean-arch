import { BannerItem } from 'src/domain/entities/store-config.entity';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('store_configs')
export class StoreConfigSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', default: [] })
  banners: BannerItem[];

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
