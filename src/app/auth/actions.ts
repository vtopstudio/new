"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const signUpSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });

export async function signUpAction(formData: FormData) {
  const parsed = signUpSchema.parse(Object.fromEntries(formData));
  const passwordHash = await bcrypt.hash(parsed.password, 10);

  try {
    await prisma.user.create({ data: { name: parsed.name, email: parsed.email.toLowerCase(), passwordHash } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      redirect("/auth/sign-up?error=email-exists");
    }
    throw error;
  }

  redirect("/auth/sign-in?registered=1");
}
