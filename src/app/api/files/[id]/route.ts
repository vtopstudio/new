import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { readStoredFile } from "@/lib/storage";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Нужна авторизация" }, { status: 401 });

  const { id } = await params;
  const file = await prisma.orderFile.findUnique({ where: { id }, include: { order: true } });
  if (!file) return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
  if (file.order.userId !== session.user.id && !isStaff(session.user.role)) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  const data = await readStoredFile(file.fileUrl);
  return new NextResponse(data, {
    headers: {
      "Content-Type": file.fileType,
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
      "Cache-Control": "private, no-store"
    }
  });
}
