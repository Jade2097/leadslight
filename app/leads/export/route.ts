import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma, Status } from '@prisma/client';

function isRealStatus(s: string | null): s is Status {
  return s === 'NEW' || s === 'IN_PROGRESS' || s === 'WON' || s === 'LOST';
}

function csvEscape(v: unknown) {
  const s = (v ?? '').toString();
  if (s.includes('"') || s.includes(',') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('status');

  const where: Prisma.LeadWhereInput = isRealStatus(q) ? { status: q } : {};

  const rows = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, status: true, note: true, createdAt: true },
  });

  const header = ['id', 'name', 'email', 'status', 'note', 'createdAt'].join(',');
  const body = rows
    .map(r => [r.id, csvEscape(r.name), csvEscape(r.email), r.status, csvEscape(r.note ?? ''), r.createdAt.toISOString()].join(','))
    .join('\n');

  return new NextResponse([header, body].join('\n'), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="leads.csv"',
      'cache-control': 'no-store',
    },
  });
}
