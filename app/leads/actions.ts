'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const VALID_STATUSES = new Set(['NEW', 'IN_PROGRESS', 'WON', 'LOST'] as const);

function validateLeadInput(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const statusRaw = String(formData.get('status') || 'NEW').trim().toUpperCase();
  const noteRaw = String(formData.get('note') || '').trim();

  if (!name) throw new Error('Nom requis');
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Email invalide');

  const status = VALID_STATUSES.has(statusRaw as any) ? statusRaw : 'NEW';
  const note = noteRaw.slice(0, 500); // limite de taille pour éviter les débordements

  return { name, email, status, note };
}

export async function createLead(formData: FormData) {
  const { name, email, status, note } = validateLeadInput(formData);
  await prisma.lead.create({ data: { name, email, status, note } });
  revalidatePath('/leads');
}

export async function updateLead(id: number, formData: FormData) {
  const { name, email, status, note } = validateLeadInput(formData);
  await prisma.lead.update({ where: { id }, data: { name, email, status, note } });
  revalidatePath('/leads');
}

export async function deleteLead(id: number) {
  await prisma.lead.delete({ where: { id } });
  revalidatePath('/leads');
}
