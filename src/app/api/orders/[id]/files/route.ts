import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const fileSchema = z.object({ fileUrl: z.string().min(1), fileType: z.string().default("link"), originalName: z.string().default("Файл") });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });
  const parsed = fileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Некорректные данные файла" }, { status: 400 });
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || (order.userId !== session.user.id && !isAdmin(session))) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const file = await prisma.orderFile.create({ data: { orderId: id, ...parsed.data, uploadedBy: session.user.id ?? "unknown" } });
  return NextResponse.json(file);
}
