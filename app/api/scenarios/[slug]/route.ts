import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const scenario = await prisma.scenario.findUnique({
    where: { slug: params.slug },
    include: {
      user: { select: { name: true, image: true } },
      branches: {
        orderBy: { orderIndex: "asc" },
        include: { timeline: { orderBy: { orderIndex: "asc" } } },
      },
      evidence: { orderBy: { credibility: "desc" } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
        take: 50,
      },
      _count: { select: { bookmarks: true, comments: true } },
    },
  });

  if (!scenario) {
    return NextResponse.json({ error: "Scenario not found" }, { status: 404 });
  }

  return NextResponse.json(scenario);
}
