import { z } from 'zod';

export const createOrderSchema = z.object({
  name: z.string(),
  email: z.email(),
  document: z.string().optional(),

  address: z.object({
    zipCode: z.string(),
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string().length(2),
  }),

  paymentMethod: z.enum(['card', 'pix']),

  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1),
    }),
  ),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
