import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
const allowed = new Set(['image/jpeg','image/png','image/webp','application/pdf']);
export async function saveOrderFile(orderId: string, file: File) {
  if (!allowed.has(file.type)) throw new Error('Недопустимый тип файла');
  if (file.size > 10 * 1024 * 1024) throw new Error('Файл больше 10 МБ');
  const safe = file.name.replace(/[^a-zA-Zа-яА-Я0-9._-]/g, '_');
  const dir = path.join(process.cwd(), 'public', 'uploads', 'orders', orderId);
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${safe}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return { fileUrl: `/uploads/orders/${orderId}/${name}`, fileType: file.type, originalName: file.name };
}
