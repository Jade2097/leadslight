// app/leads/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { createLead, disableLead } from './actions';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, status: true, note: true, createdAt: true },
  });

  const statusLabel: Record<string, string> = {
    NEW: 'Nouveau',
    IN_PROGRESS: 'En cours',
    WON: 'Gagné',
    LOST: 'Perdu',
  };

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">Leads</h1>
        <p className="text-muted">
          Créez un lead puis suivez son statut. Export CSV disponible pour vos outils externes.
        </p>
        <Link href="/leads/export" className="text-primary hover:underline">
          Exporter CSV
        </Link>
      </header>

      <section className="card p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Nouveau lead</h2>
        <form action={async (fd: FormData) => {
          'use server';
          try { await createLead(fd); }
          catch (err) { console.error('Erreur création lead', err); }
        }} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="label" htmlFor="name">Nom</label>
            <input className="input" id="name" name="name" required maxLength={120} placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="email">Email</label>
            <input className="input" id="email" name="email" type="email" required maxLength={160} placeholder="jane@example.com" />
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="status">Statut</label>
            <select className="select" id="status" name="status" defaultValue="NEW">
              <option value="NEW">Nouveau</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="WON">Gagné</option>
              <option value="LOST">Perdu</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="label" htmlFor="note">Note</label>
            <input className="input" id="note" name="note" maxLength={500} placeholder="Contexte, next step…" />
          </div>
          <div className="md:col-span-2">
            <button className="button" type="submit">Enregistrer</button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Liste</h2>
        {leads.length === 0 ? (
          <p className="text-muted">Aucun lead pour le moment.</p>
        ) : (
          <div className="overflow-x-auto card">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Statut</th>
                  <th>Note</th>
                  <th>Créé</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="font-semibold">{l.name}</td>
                    <td><a href={`mailto:${l.email}`} className="text-primary hover:underline">{l.email}</a></td>
                    <td>{statusLabel[l.status] ?? l.status}</td>
                    <td className="text-muted">{l.note || '—'}</td>
                    <td className="text-muted">{l.createdAt.toLocaleDateString('fr-FR')}</td>
                    <td className="text-right">
                      <Link href={`/leads/${l.id}/edit`} className="text-primary hover:underline mr-3">
                        Éditer
                      </Link>
                      <form
                        action={async () => { 'use server'; await disableLead(l.id); }}
                        className="inline"
                      >
                        <button type="submit" className="text-muted hover:underline">Désactiver</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
