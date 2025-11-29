-- This is an empty migration.
-- Backfill
UPDATE "Lead" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
/* Remarque: SQLite gère mal ALTER COLUMN SET DEFAULT.
   Ce n’est pas bloquant: Prisma remplira updatedAt grâce à @updatedAt.
   Tu peux laisser seulement le backfill. */
