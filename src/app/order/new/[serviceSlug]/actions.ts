'use server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateDesignPrompt } from '@/lib/prompt-engine';
import { saveOrderFile } from '@/lib/storage';
const schema = z.object({ serviceSlug: z.string() });
export async function createOrder(formData: FormData) {
  const user = await requireUser();
  const { serviceSlug } = schema.parse({ serviceSlug: formData.get('serviceSlug') });
  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
  if (!service) throw new Error('Услуга не найдена');
  const fields = service.fieldsConfig as { name: string; label: string; required?: boolean }[];
  const briefData: Record<string, string> = {};
  for (const field of fields) { const value = String(formData.get(field.name) || '').trim(); if (field.required && !value) throw new Error(`Заполните поле ${field.label}`); briefData[field.name] = value; }
  const prompt = generateDesignPrompt({ service, briefData });
  const order = await prisma.order.create({ data: { userId: user.id, serviceId: service.id, briefData, generatedPrompt: prompt, price: service.basePrice, status: 'WAITING_PAYMENT', paymentStatus: 'PENDING' } });
  const files = formData.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  const saved = [];
  for (const file of files) { const meta = await saveOrderFile(order.id, file); saved.push(await prisma.orderFile.create({ data: { orderId: order.id, uploadedBy: user.id, ...meta } })); }
  if (saved.length) await prisma.order.update({ where: { id: order.id }, data: { generatedPrompt: generateDesignPrompt({ service, briefData, files: saved }) } });
  redirect(`/dashboard/orders/${order.id}`);
}
