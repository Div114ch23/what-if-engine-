import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateSimulation } from "@/lib/anthropic";
import { simulationQuerySchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");

  const simulations = await prisma.simulation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      scenario: { select: { title: true, slug: true } },
    },
  });

  return NextResponse.json(simulations);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check simulation limits
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscriptions: true },
  });

  const isPremium = user?.role === "PREMIUM" || user?.role === "ADMIN";
  const monthlyCount = await prisma.simulation.count({
    where: {
      userId: session.user.id,
      createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    },
  });

  if (!isPremium && monthlyCount >= 3) {
    return NextResponse.json(
      { error: "Monthly simulation limit reached for this calendar month. Upgrade to Premium for unlimited simulations." },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = simulationQuerySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Create pending simulation
  const simulation = await prisma.simulation.create({
    data: {
      query: parsed.data.query,
      category: parsed.data.category,
      parameters: parsed.data.parameters || {},
      status: "PROCESSING",
      userId: session.user.id,
    },
  });

  try {
    const result = await generateSimulation({
      query: parsed.data.query,
      category: parsed.data.category,
      parameters: parsed.data.parameters,
    });

    const updated = await prisma.simulation.update({
      where: { id: simulation.id },
      data: {
        result: result as any,
        aiAnalysis: result.analysis,
        confidence: result.confidence,
        status: "COMPLETED",
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "RUN_SIMULATION",
        entity: "SIMULATION",
        entityId: simulation.id,
        userId: session.user.id,
        metadata: { query: parsed.data.query, category: parsed.data.category },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    await prisma.simulation.update({
      where: { id: simulation.id },
      data: { status: "FAILED" },
    });

    return NextResponse.json(
      { error: "Simulation failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
