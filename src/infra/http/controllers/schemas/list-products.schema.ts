import { z } from 'zod';

export class ListProductsSchema {
  static schema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(10),
  });
}

export type ListProductsDto = z.infer<typeof ListProductsSchema.schema>;
