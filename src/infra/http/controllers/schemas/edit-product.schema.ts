import { z } from 'zod';
import { CreateProductSchema } from './create-product.schema';

export class EditProductSchema {
  static schema = CreateProductSchema.schema.partial();
}

export type EditProductDto = z.infer<typeof EditProductSchema.schema>;
