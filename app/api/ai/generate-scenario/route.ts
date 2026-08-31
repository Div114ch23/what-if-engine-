import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateScenarioFromQuery } from "@/lib/anthropic";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { query } = body;

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  try {
    const result = await generateScenarioFromQuery(query);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Generation failed", message: error.message },
      { status: 500 }
    );
  }
}
