"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const signUpSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.parse(Object.fromEntries(formData));
  const passwordHash = await bcrypt.hash(parsed.password, 10);
  await prisma.user.create({ data: { name: parsed.name, email: parsed.email.toLowerCase(), passwordHash } });
  redirect("/auth/sign-in?registered=1");
}
