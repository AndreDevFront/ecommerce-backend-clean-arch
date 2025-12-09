/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  StorageGateway,
  UploadParams,
} from 'src/domain/gateways/storage.gateway';
import { EnvService } from '../env/env.service';

@Injectable()
export class R2StorageGateway implements StorageGateway {
  private client: S3Client;

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: envService.getAwsEndpoint,
      region: 'auto',
      credentials: {
        accessKeyId: envService.getAwsAccessKeyId,
        secretAccessKey: envService.getAwsSecretAccessKey,
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uniqueFileName = `${randomUUID()}-${fileName}`;
    const bucketName = this.envService.getAwsBucketName;

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      },
    });

    await upload.done();

    const publicUrl = `${this.envService.getAwsBucketPublicUrl}/${uniqueFileName}`;

    return { url: publicUrl };
  }
}
