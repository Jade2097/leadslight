// lib/prisma.ts
import { PrismaClient } from '@/generated/client'; // ou depuis '@prisma/client' si tu es revenu au chemin par défaut
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// ⚠️ Important: avec Prisma 7, on passe un "options object" au constructeur
// et on fournit l'adapter pour la connexion.
const adapter = new PrismaBetterSqlite3({
  url: 'file:./prisma/dev.db', // même chemin que dans .env/CLI
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
