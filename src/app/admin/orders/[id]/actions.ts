"use server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

const statusSchema = z.enum(["WAITING_PAYMENT", "PAID", "IN_PROGRESS", "NEEDS_CLARIFICATION", "READY", "COMPLETED", "CANCELLED"]);
const resultSchema = z.object({ title: z.string().min(1), description: z.string().min(1), imageUrl: z.string().min(1) });

async function guard() {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) redirect("/dashboard");
}

export async function updateOrderStatus(id: string, formData: FormData) {
  await guard();
  const status = statusSchema.parse(formData.get("status"));
  await prisma.order.update({ where: { id }, data: { status, adminComment: String(formData.get("adminComment") || "") } });
  revalidatePath(`/admin/orders/${id}`);
}

export async function addResult(id: string, formData: FormData) {
  await guard();
  const data = resultSchema.parse({ title: formData.get("title"), description: formData.get("description"), imageUrl: formData.get("imageUrl") });
  await prisma.designResult.create({ data: { orderId: id, ...data } });
  await prisma.order.update({ where: { id }, data: { status: "READY" } });
  revalidatePath(`/admin/orders/${id}`);
}
