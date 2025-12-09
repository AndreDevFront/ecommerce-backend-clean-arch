import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().startsWith('postgresql://'),
  PORT: z.coerce.number().positive().default(3000),
  JWT_PRIVATE_KEY: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_BUCKET_NAME: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ENDPOINT: z.url(),
  AWS_BUCKET_PUBLIC_URL: z.url(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export const databaseSchema = z.object({
  host: z.string().default('localhost'),
  port: z.coerce.number().positive().default(5432),
  username: z.string().default('admin'),
  password: z.string().default('admin123'),
  database: z.string().default('velas_db'),
});

export type Env = z.infer<typeof envSchema>;
