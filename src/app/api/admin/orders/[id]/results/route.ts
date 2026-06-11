import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const resultSchema = z.object({ title: z.string().min(1), description: z.string().min(1), imageUrl: z.string().min(1) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const parsed = resultSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Заполните результат" }, { status: 400 });
  const { id } = await params;
  const result = await prisma.designResult.create({ data: { orderId: id, ...parsed.data } });
  await prisma.order.update({ where: { id }, data: { status: "READY" } });
  return NextResponse.json(result);
}
