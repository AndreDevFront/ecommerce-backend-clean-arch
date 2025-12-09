import { Injectable } from '@nestjs/common';
import { StorageGateway } from 'src/domain/gateways/storage.gateway';

interface UploadImageRequest {
  fileName: string;
  fileType: string;
  body: Buffer;
}

@Injectable()
export class UploadImageUseCase {
  constructor(private storageGateway: StorageGateway) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadImageRequest): Promise<{ url: string }> {
    const { url } = await this.storageGateway.upload({
      fileName,
      fileType,
      body,
    });

    return { url };
  }
}
