'use server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { saveOrderFile } from '@/lib/storage';
const statusSchema = z.object({ orderId: z.string(), status: z.enum(['DRAFT','WAITING_PAYMENT','PAID','IN_PROGRESS','NEEDS_CLARIFICATION','READY','COMPLETED','CANCELLED']), adminComment: z.string().optional() });
export async function updateOrderStatus(formData: FormData) { await requireRole(['ADMIN','OPERATOR']); const data = statusSchema.parse(Object.fromEntries(formData.entries())); await prisma.order.update({ where: { id: data.orderId }, data: { status: data.status, adminComment: data.adminComment || null } }); revalidatePath(`/admin/orders/${data.orderId}`); }
export async function uploadDesignResult(formData: FormData) { const user = await requireRole(['ADMIN','OPERATOR']); const orderId = String(formData.get('orderId')); const file = formData.get('file'); if (!(file instanceof File) || !file.size) throw new Error('Загрузите файл'); const saved = await saveOrderFile(orderId, file); await prisma.orderFile.create({ data: { orderId, uploadedBy: user.id, ...saved } }); await prisma.designResult.create({ data: { orderId, imageUrl: saved.fileUrl, title: String(formData.get('title') || file.name), description: String(formData.get('description') || 'Готовый вариант дизайна') } }); await prisma.order.update({ where: { id: orderId }, data: { status: 'READY' } }); revalidatePath(`/admin/orders/${orderId}`); }
