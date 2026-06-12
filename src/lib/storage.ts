import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
export const maxFileBytes = 8 * 1024 * 1024;
export const maxOrderUploadBytes = 32 * 1024 * 1024;
const uploadRoot = path.join(process.cwd(), ".data", "uploads");

export type StoredFile = { fileUrl: string; fileType: string; originalName: string };

function safeFileName(name: string) {
  const normalized = name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ._-]/g, "-");
  return `${Date.now()}-${normalized}`;
}

export function protectedFileUrl(fileId: string) {
  return `/api/files/${fileId}`;
}

export function validateAggregateUploadSize(files: File[]) {
  const total = files.reduce((sum, file) => sum + file.size, 0);
  if (total > maxOrderUploadBytes) throw new Error("Суммарный размер файлов не должен превышать 32 МБ.");
}

export async function saveOrderFile(orderId: string, file: File): Promise<StoredFile> {
  if (!allowedTypes.has(file.type)) throw new Error("Разрешены только jpg, png, webp и pdf файлы.");
  if (file.size > maxFileBytes) throw new Error("Размер файла не должен превышать 8 МБ.");

  const safeName = safeFileName(file.name);
  const relativePath = path.join("orders", orderId, safeName);
  const absolutePath = path.join(uploadRoot, relativePath);
  const normalized = path.normalize(absolutePath);
  if (!normalized.startsWith(uploadRoot + path.sep)) throw new Error("Некорректный путь файла.");

  await mkdir(path.dirname(normalized), { recursive: true });
  await writeFile(normalized, Buffer.from(await file.arrayBuffer()));
  return { fileUrl: relativePath, fileType: file.type, originalName: file.name };
}

export async function readStoredFile(fileUrl: string) {
  const absolutePath = path.join(uploadRoot, fileUrl);
  const normalized = path.normalize(absolutePath);
  if (!normalized.startsWith(uploadRoot + path.sep)) throw new Error("Некорректный путь файла.");
  return readFile(normalized);
}
