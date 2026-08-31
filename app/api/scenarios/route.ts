import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createScenarioSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "recent";

  const where: any = { isPublic: true, status: "PUBLISHED" };

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { tags: { has: search } },
    ];
  }

  const orderBy =
    sort === "popular"
      ? { viewCount: "desc" }
      : sort === "likes"
      ? { likeCount: "desc" }
      : { createdAt: "desc" };

  const scenarios = await prisma.scenario.findMany({
    where,
    orderBy,
    include: {
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true, bookmarks: true, branches: true } },
    },
  });

  return NextResponse.json(scenarios);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createScenarioSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const slug = generateSlug(parsed.data.title);
  const existing = await prisma.scenario.findUnique({ where: { slug } });

  if (existing) {
    return NextResponse.json(
      { error: "A scenario with this title already exists" },
      { status: 409 }
    );
  }

  const scenario = await prisma.scenario.create({
    data: {
      ...parsed.data,
      slug,
      userId: session.user.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "CREATE_SCENARIO",
      entity: "SCENARIO",
      entityId: scenario.id,
      userId: session.user.id,
    },
  });

  return NextResponse.json(scenario, { status: 201 });
}
