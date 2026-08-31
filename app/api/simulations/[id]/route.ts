import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const simulation = await prisma.simulation.findUnique({
    where: { id: params.id },
    include: { scenario: { select: { title: true, slug: true } } },
  });

  if (!simulation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (simulation.userId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(simulation);
}
