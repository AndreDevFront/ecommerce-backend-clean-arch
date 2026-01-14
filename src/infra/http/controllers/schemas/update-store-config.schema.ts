import { z } from 'zod';

const BannerItemSchema = z.object({
  id: z
    .uuid()
    .optional()
    .default(() => crypto.randomUUID()),
  imageUrl: z.string().url({ message: 'URL da imagem inválida' }),
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional().default(''),
  ctaText: z.string().min(1, 'Texto do botão é obrigatório'),
  ctaLink: z.string().min(1, 'Link do botão é obrigatório'),
});

export class UpdateStoreConfigSchema {
  static schema = z.object({
    banners: z
      .array(BannerItemSchema)
      .min(1, 'A loja precisa de pelo menos 1 banner'),
  });
}

export type UpdateStoreConfigDto = z.infer<
  typeof UpdateStoreConfigSchema.schema
>;
