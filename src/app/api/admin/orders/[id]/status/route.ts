import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const statusSchema = z.object({
  status: z.enum(["DRAFT", "WAITING_PAYMENT", "PAID", "IN_PROGRESS", "NEEDS_CLARIFICATION", "READY", "COMPLETED", "CANCELLED"]),
  adminComment: z.string().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  const parsed = statusSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
  const { id } = await params;
  const order = await prisma.order.update({ where: { id }, data: parsed.data });
  return NextResponse.json(order);
}
