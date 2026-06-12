import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { authOptions, isStaff } from "@/lib/auth";
import { markPaymentCanceled, markPaymentSucceeded } from "@/lib/payment-sync";
import { prisma } from "@/lib/prisma";
import { getYooKassaPayment } from "@/lib/yookassa";

const schema = z.object({ providerPaymentId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!isStaff(session?.user?.role)) return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });

  const { providerPaymentId } = schema.parse(await request.json());
  const provider = await getYooKassaPayment(providerPaymentId);
  const rawPayload = JSON.parse(JSON.stringify(provider)) as Prisma.InputJsonValue;
  const payment = await prisma.payment.findUnique({ where: { providerPaymentId } });
  if (!payment) return NextResponse.json({ error: "Платёж не найден" }, { status: 404 });

  if (provider.status === "succeeded") await markPaymentSucceeded(payment.id, rawPayload);
  if (provider.status === "canceled") await markPaymentCanceled(payment.id, rawPayload);

  return NextResponse.json({ status: provider.status });
}
