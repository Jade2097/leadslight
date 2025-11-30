import { prisma } from '@/lib/prisma';
import { updateLead } from '../../actions';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id)) return <p className="text-red-400">Identifiant invalide.</p>;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return <p className="text-red-400">Lead introuvable.</p>;

  return (
    <section className="space-y-4 max-w-xl">
      <h2 className="text-3xl font-semibold">Modifier</h2>
      <form action={async (fd: FormData) => { 'use server'; await updateLead(id, fd); }} className="space-y-3">
        <input className="w-full bg-transparent border p-2 rounded" name="name" defaultValue={lead.name} required />
        <input className="w-full bg-transparent border p-2 rounded" type="email" name="email" defaultValue={lead.email} required />
        <select className="w-full bg-transparent border p-2 rounded" name="status" defaultValue={lead.status}>
          <option value="NEW">Nouveau</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="WON">Gagné</option>
          <option value="LOST">Perdu</option>
        </select>
        <input className="w-full bg-transparent border p-2 rounded" name="note" defaultValue={lead.note || ''} />
        <button className="px-4 py-2 bg-white text-black rounded">Enregistrer</button>
      </form>
    </section>
  );
}
