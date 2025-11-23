import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { createLead, deleteLead } from './actions';
import type { Prisma, Status } from '@prisma/client'; // 👈 important

export const dynamic = 'force-dynamic';

const STATUSES = ['ALL', 'NEW', 'IN_PROGRESS', 'WON', 'LOST'] as const;
type StatusOrAll = typeof STATUSES[number];

// type‑guard: vérifie que c’est bien une valeur de l’enum Prisma.Status
function isRealStatus(s: string | null | undefined): s is Status {
  return s === 'NEW' || s === 'IN_PROGRESS' || s === 'WON' || s === 'LOST';
}

async function getLeads(statusParam?: string) {
  // normalise la query (?status=) en UPPERCASE
  const s = (statusParam || 'ALL').toUpperCase() as StatusOrAll;

  // construit un where typé correctement pour Prisma
  const where: Prisma.LeadWhereInput = isRealStatus(s) ? { status: s } : {};

  return prisma.lead.findMany({ where, orderBy: { createdAt: 'desc' } });
}

export default async function LeadsPage({ searchParams }: { searchParams: { status?: string } }) {
  const s = (searchParams.status || 'ALL').toUpperCase() as StatusOrAll;
  const leads = await getLeads(s);

  // pour le lien Export, on ne propage le filtre que s’il est valide
  const exportHref = isRealStatus(s) ? `/leads/export?status=${s}` : '/leads/export';

  const pill = (active: boolean) =>
    [
      'px-3 py-1.5 rounded-md border text-sm transition',
      active ? 'bg-slate-100 text-slate-900 border-slate-300' : 'border-slate-300/40 text-slate-600 hover:bg-slate-50',
    ].join(' ');

  return (
    <section className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-3xl font-semibold">Leads</h2>
        <div className="flex gap-2">
          {STATUSES.map((st) => (
            <Link key={st} href={`/leads?status=${st}`} className={pill(s === st)}>
              {st}
            </Link>
          ))}
          <Link href={exportHref} className="px-3 py-1.5 rounded-md border border-slate-300/60 text-slate-800 hover:bg-slate-50">
            Export CSV
          </Link>
        </div>
      </div>

      <form action={createLead} className="grid sm:grid-cols-5 gap-2">
        <input className="bg-transparent border border-slate-300 p-2 rounded" name="name" placeholder="Nom" required />
        <input className="bg-transparent border border-slate-300 p-2 rounded" type="email" name="email" placeholder="Email" required />
        <select className="bg-transparent border border-slate-300 p-2 rounded" name="status" defaultValue="NEW">
          <option value="NEW">Nouveau</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="WON">Gagné</option>
          <option value="LOST">Perdu</option>
        </select>
        <input className="bg-transparent border border-slate-300 p-2 rounded" name="note" placeholder="Note (facultatif)" />
        <button className="px-4 py-2 bg-slate-900 text-white rounded">Ajouter</button>
      </form>

      <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
        {leads.map((l) => (
          <li key={l.id} className="p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-medium">
                {l.name} — <span className="text-slate-500">{l.email}</span>
              </div>
              <div className="text-slate-500 text-sm">
                {l.status} {l.note ? `· ${l.note}` : ''}
              </div>
            </div>
            <div className="flex gap-2">
              <Link className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50" href={`/leads/${l.id}/edit`}>Éditer</Link>
              <form action={async () => { 'use server'; await deleteLead(l.id); }}>
                <button className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-50" type="submit">Supprimer</button>
              </form>
            </div>
          </li>
        ))}
        {leads.length === 0 && <li className="p-6 text-slate-500">Aucun lead pour ce filtre.</li>}
      </ul>
    </section>
  );
}
