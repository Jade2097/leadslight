// lib/prisma.ts
import { PrismaClient } from '@/generated/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaLibSql as PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient as createLibsqlClient } from '@libsql/client';

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const isLibsql = dbUrl.startsWith('libsql:') || dbUrl.includes('.turso.io');

// Choix d'adapter en fonction de l'URL (libsql/Turso en prod, SQLite fichier en local).
const adapter = isLibsql
  ? new PrismaLibSQL(
      createLibsqlClient({
        url: dbUrl,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    )
  : new PrismaBetterSqlite3({ url: dbUrl });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
