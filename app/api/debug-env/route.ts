// app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const token = process.env.TURSO_AUTH_TOKEN || '';
  const isLibsql = dbUrl.startsWith('libsql:') || dbUrl.includes('.turso.io');

  return NextResponse.json({
    dbUrl,
    tokenPrefix: token ? token.slice(0, 8) : '',
    isLibsql,
  });
}
