import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scenario = await prisma.scenario.findUnique({
    where: { slug: params.slug },
  });

  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
  }

  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_scenarioId: { userId: session.user.id, scenarioId: scenario.id },
    },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    await prisma.scenario.update({
      where: { id: scenario.id },
      data: { likeCount: { decrement: 1 } },
    });
    return NextResponse.json({ bookmarked: false });
  }

  await prisma.bookmark.create({
    data: { userId: session.user.id, scenarioId: scenario.id },
  });
  await prisma.scenario.update({
    where: { id: scenario.id },
    data: { likeCount: { increment: 1 } },
  });

  return NextResponse.json({ bookmarked: true });
}
