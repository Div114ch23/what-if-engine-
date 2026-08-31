import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  if (!webhookSecret) return NextResponse.json({ error: "Stripe webhook secret is not configured" }, { status: 503 });
  const payload = await request.text();
  const signature = headers().get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${(err as Error).message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;
        const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
        const userId = subscription.metadata?.userId || session.metadata?.userId;
        if (!userId) break;
        await prisma.user.update({ where: { id: userId }, data: { role: "PREMIUM" } });
        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            status: subscription.status as any,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          update: {
            stripeCustomerId: String(session.customer),
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            status: subscription.status as any,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        const record = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscription.id } });
        if (!record) break;
        const active = ["active", "trialing"].includes(subscription.status);
        await prisma.user.update({ where: { id: record.userId }, data: { role: active ? "PREMIUM" : "USER" } });
        await prisma.subscription.update({
          where: { id: record.id },
          data: {
            status: subscription.status as any,
            stripePriceId: subscription.items.data[0]?.price.id,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id;
        if (!subscriptionId) break;
        await prisma.subscription.updateMany({ where: { stripeSubscriptionId: subscriptionId }, data: { status: "PAST_DUE" } });
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const record = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subscription.id } });
        if (!record) break;
        await prisma.user.update({ where: { id: record.userId }, data: { role: "USER" } });
        await prisma.subscription.update({ where: { id: record.id }, data: { status: "CANCELED", cancelAtPeriodEnd: false } });
        break;
      }
    }
  } catch (error) {
    return NextResponse.json({ error: "Webhook processing failed", message: (error as Error).message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
