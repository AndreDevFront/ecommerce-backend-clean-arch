import { randomUUID } from 'crypto';

export type BannerItem = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
};

export type StoreConfigProps = {
  id?: string;
  banners: BannerItem[];
  updatedAt?: Date;
};

export class StoreConfig {
  private _props: StoreConfigProps;

  constructor(props: StoreConfigProps) {
    this._props = {
      ...props,
      id: props.id ?? randomUUID(),
      banners: props.banners ?? [],
      updatedAt: props.updatedAt ?? new Date(),
    };
  }

  get id() {
    return this._props.id;
  }

  get banners() {
    return this._props.banners;
  }

  get updatedAt() {
    return this._props.updatedAt;
  }

  public updateBanners(banners: BannerItem[]) {
    this._props.banners = banners;
    this.touch();
  }

  private touch() {
    this._props.updatedAt = new Date();
  }

  public toJSON() {
    return {
      id: this.id,
      banners: this.banners,
      updatedAt: this.updatedAt,
    };
  }
}
