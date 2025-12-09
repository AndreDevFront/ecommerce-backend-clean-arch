import { z } from 'zod';

export class CreateProductSchema {
  static schema = z.object({
    name: z.string(),
    slug: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    attributes: z.record(z.string(), z.any()).optional(),
    image: z.string().optional().nullable(),
  });
}

export type CreateProductDto = z.infer<typeof CreateProductSchema.schema>;
