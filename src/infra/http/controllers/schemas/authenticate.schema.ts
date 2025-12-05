import { z } from 'zod';

export class AuthenticateSchema {
  static schema = z.object({
    email: z.email({ message: 'Email inválido' }).trim().toLowerCase(),
    password: z.string().min(1),
  });
}

export type AuthenticateDto = z.infer<typeof AuthenticateSchema.schema>;
