import { z } from 'zod';

export class PlaceOrderSchema {
  static schema = z.object({
    items: z
      .array(
        z.object({
          productId: z.uuid({ message: 'ID do produto inválido' }),
          quantity: z.coerce
            .number()
            .int()
            .positive({ message: 'Quantidade deve ser maior que zero' }),
        }),
      )
      .min(1, { message: 'O pedido deve ter pelo menos 1 item' }),

    shippingAddress: z.object({
      street: z.string().min(3, { message: 'Rua deve ter no mínimo 3 letras' }),
      city: z.string().min(2, { message: 'Cidade inválida' }),
      zipCode: z.string().min(8, { message: 'CEP deve ter 8 dígitos' }),
    }),
  });
}

export type PlaceOrderDto = z.infer<typeof PlaceOrderSchema.schema>;
