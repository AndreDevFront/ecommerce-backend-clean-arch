import { z } from 'zod';

export class CreateUserSchema {
  static schema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.email({ message: 'Email inválido' }).trim().toLowerCase(),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  });
}

export type CreateUserDto = z.infer<typeof CreateUserSchema.schema>;
