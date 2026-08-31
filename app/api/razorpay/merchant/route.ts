import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { calculateMerchantMetrics, demoMerchantMetrics } from "@/lib/merchant-analytics";
import { fetchRecentOrders, isRazorpayConfigured } from "@/lib/razorpay";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isRazorpayConfigured()) {
    return NextResponse.json({
      connected: false,
      testMode: true,
      metrics: demoMerchantMetrics(),
      message: "Razorpay test keys are not configured. Showing a clearly labelled demo dataset.",
    });
  }

  try {
    const orders = await fetchRecentOrders(100);
    return NextResponse.json({
      connected: true,
      testMode: true,
      metrics: calculateMerchantMetrics(orders),
    });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      testMode: true,
      metrics: demoMerchantMetrics(),
      error: (error as Error).message,
      message: "Could not read Razorpay test-mode data; showing the demo dataset instead.",
    }, { status: 200 });
  }
}
