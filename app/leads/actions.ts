'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createLead(formData: FormData) {
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const status = String(formData.get('status') || 'NEW') as any;
  const note = String(formData.get('note') || '');
  // Certains environnements n'appliquent pas le DEFAULT CURRENT_TIMESTAMP de SQLite :
  // on hydrate createdAt/updatedAt côté app pour éviter les erreurs "NOT NULL constraint failed".
  const now = new Date();
  await prisma.lead.create({ data: { name, email, status, note, createdAt: now, updatedAt: now } });
  revalidatePath('/leads');
}

export async function updateLead(id: number, formData: FormData) {
  const name = String(formData.get('name') || '');
  const email = String(formData.get('email') || '');
  const status = String(formData.get('status') || 'NEW') as any;
  const note = String(formData.get('note') || '');
  await prisma.lead.update({ where: { id }, data: { name, email, status, note } });
  revalidatePath('/leads');
}

export async function deleteLead(id: number) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath('/leads');
}
