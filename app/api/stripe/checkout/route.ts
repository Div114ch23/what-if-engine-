import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { priceId } = body;

  const allowedPriceIds = [process.env.STRIPE_PREMIUM_PRICE_ID, process.env.STRIPE_TEAM_PRICE_ID].filter(Boolean);
  if (!priceId || !allowedPriceIds.includes(priceId)) {
    return NextResponse.json({ error: "Invalid or unconfigured subscription plan" }, { status: 400 });
  }

  let subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name || undefined,
    });
    customerId = customer.id;

    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        stripeCustomerId: customerId,
        status: "INCOMPLETE",
      },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    metadata: { userId: session.user.id },
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
    subscription_data: {
      metadata: { userId: session.user.id },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
