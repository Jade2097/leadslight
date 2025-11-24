// prisma.config.ts 
import 'dotenv/config';
import path from 'node:path';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrations: { path: path.join('prisma', 'migrations') },
  datasource: {
    // l’URL de connexion vit ici (plus dans schema.prisma)
    url: env('DATABASE_URL'),
  },
});
