# LeadsLight

Mini CRM Next.js / Prisma (Postgres) pour créer, mettre à jour et exporter des leads.

## Prérequis
- Node.js 20+ (obligatoire pour Next 16 / Prisma 7)
- Une base Postgres (Neon, Supabase, Vercel Postgres, etc.)

## Installation (local)
```bash
npm install
npx prisma db push      # applique le schéma sur ta base Postgres
npm run dev
```

## Variables d’environnement
- `DATABASE_URL` : connexion Postgres (`postgresql://user:pass@host:port/db`)
- `NODE_VERSION` : 20 (pour Vercel)

## Scripts utiles
- `npm run dev` : serveur de dev
- `npm run build` : build de prod
- `npm run start` : démarre le build
- `npx prisma db push` : pousse le schéma sur la base
- `npx prisma migrate deploy` : applique les migrations existantes (si tu utilises les migrations Prisma)

## Fonctionnalités
- Liste des leads, création via formulaire (/leads)
- Statuts : `NEW`, `IN_PROGRESS`, `WON`, `LOST`
- Validation côté serveur (email, longueur des champs, statut)
- Export CSV : `/leads/export`
- Édition d’un lead : `/leads/[id]/edit`

## Déploiement Vercel
1. Définir `DATABASE_URL` (Postgres) et `NODE_VERSION=20` dans les env (Production/Preview).
2. Appliquer le schéma sur la base cible (`npx prisma db push` ou `npx prisma migrate deploy`).
3. Déployer (`npm run build` côté CI).
