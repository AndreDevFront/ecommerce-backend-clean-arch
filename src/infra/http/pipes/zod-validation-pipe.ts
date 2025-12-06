import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' && metadata.type !== 'query') {
      return value;
    }

    try {
      return this.schema.parse(value);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',

          errors: error.issues.map((issue) => {
            return {
              path: issue.path,
              message: issue.message,
            };
          }),
        });
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
