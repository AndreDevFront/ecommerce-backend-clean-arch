/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImageUseCase } from 'src/application/use-cases/upload-image.use-case';

@Controller('uploads')
export class UploadController {
  constructor(private uploadImage: UploadImageUseCase) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2MB
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|webp)' }),
        ],
        errorHttpStatusCode: 400,
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const { originalname, mimetype, buffer } = file;

    const { url } = await this.uploadImage.execute({
      fileName: originalname as string,
      fileType: mimetype as string,
      body: buffer as Buffer,
    });

    return { url };
  }
}
