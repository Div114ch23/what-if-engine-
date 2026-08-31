import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createTestOrder, getRazorpayPublicKey, isRazorpayConfigured } from "@/lib/razorpay";
import { z } from "zod";

const orderSchema = z.object({
  amount: z.number().int().min(100).max(1000000),
  confirmed: z.literal(true),
  action: z.enum(["RECOVER", "UPSELL", "OPTIMIZE_CHECKOUT"]),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isRazorpayConfigured()) return NextResponse.json({ error: "Razorpay test-mode keys are not configured." }, { status: 503 });

  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "A confirmed, bounded test action is required." }, { status: 400 });

  try {
    const receipt = `ai-growth-${Date.now()}-${session.user.id.slice(-6)}`;
    const order = await createTestOrder({
      amount: parsed.data.amount,
      receipt,
      notes: {
        source: "What If Engine",
        action: parsed.data.action,
        mode: "TEST_ONLY",
        gated: "user_confirmed",
      },
    });
    await import("@/lib/prisma").then(({ prisma }) => prisma.auditLog.create({
      data: {
        action: "RAZORPAY_TEST_ORDER_CREATED",
        entity: "RAZORPAY_ORDER",
        entityId: order.id,
        userId: session.user.id,
        metadata: { amount: parsed.data.amount, action: parsed.data.action, mode: "TEST" },
      },
    }));
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: getRazorpayPublicKey(), testMode: true });
  } catch (error) {
    return NextResponse.json({ error: "Could not create Razorpay test order", message: (error as Error).message }, { status: 502 });
  }
}
