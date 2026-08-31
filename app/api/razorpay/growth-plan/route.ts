import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateGrowthPlan } from "@/lib/growth-agent";
import { MerchantMetrics } from "@/lib/merchant-analytics";
import { z } from "zod";

const metricsSchema = z.object({
  orderCount: z.number(), paidOrderCount: z.number(), failedPaymentCount: z.number(), successfulPaymentCount: z.number(),
  paymentAttempts: z.number(), successRate: z.number(), grossOrderValue: z.number(),
  capturedRevenue: z.number(), failedValue: z.number(), averageOrderValue: z.number(),
  refundedValue: z.number(), paymentMethodMix: z.record(z.number()), currency: z.string(), periodLabel: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const parsed = metricsSchema.safeParse(body?.metrics);
  if (!parsed.success) return NextResponse.json({ error: "Invalid merchant metrics" }, { status: 400 });
  try {
    const plan = await generateGrowthPlan(parsed.data as MerchantMetrics);
    return NextResponse.json(plan);
  } catch (error) {
    return NextResponse.json({ error: "Growth analysis failed", message: (error as Error).message }, { status: 500 });
  }
}
