// lib/prisma.ts
import { PrismaClient } from '@/generated/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Retour en SQLite local (fichier prisma/dev.db)
const adapter = new PrismaBetterSqlite3({ url: 'file:./prisma/dev.db' });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
