// app/leads/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, status: true, note: true, createdAt: true },
  });

  return (
    <main>
      <h1>Leads</h1>
      <Link href="/leads/export">Exporter CSV</Link>
      <ul>
        {leads.map((l) => (
          <li key={l.id}>
            {l.name} — {l.email} — {l.status}
          </li>
        ))}
      </ul>
    </main>
  );
}
