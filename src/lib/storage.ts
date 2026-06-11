import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const maxBytes = 8 * 1024 * 1024;

export type StoredFile = { fileUrl: string; fileType: string; originalName: string };

export async function saveOrderFile(orderId: string, file: File): Promise<StoredFile> {
  if (!allowedTypes.has(file.type)) throw new Error("Разрешены только jpg, png, webp и pdf файлы.");
  if (file.size > maxBytes) throw new Error("Размер файла не должен превышать 8 МБ.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, "-")}`;
  const dir = path.join(process.cwd(), "public", "uploads", "orders", orderId);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), bytes);
  return { fileUrl: `/uploads/orders/${orderId}/${safeName}`, fileType: file.type, originalName: file.name };
}
