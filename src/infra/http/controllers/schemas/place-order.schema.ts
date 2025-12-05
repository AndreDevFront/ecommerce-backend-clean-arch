import { z } from 'zod';

export class PlaceOrderSchema {
  static schema = z.object({
    customerInfo: z.object({
      name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 letras' }),
      email: z.email({ message: 'E-mail inválido' }),
      address: z.string().min(5, { message: 'Endereço muito curto' }),
      city: z.string().min(2, { message: 'Cidade inválida' }),
      zipCode: z.string().min(5, { message: 'CEP inválido' }),
    }),

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
  });
}

export type PlaceOrderDto = z.infer<typeof PlaceOrderSchema.schema>;
