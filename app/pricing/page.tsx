"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const plans = [
  { name: "Premium", price: "Configured in Stripe", priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID, features: ["Unlimited simulations", "Merchant Growth Studio", "AI agent audit trail"] },
  { name: "Team", price: "Configured in Stripe", priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID, features: ["Everything in Premium", "Team workflows", "Priority experiments"] },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const checkout = async (priceId?: string) => {
    if (!priceId) return;
    setLoading(priceId);
    const res = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ priceId }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Checkout unavailable");
    setLoading(null);
  };
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-10"><Badge>What If? Engine</Badge><h1 className="text-4xl font-bold mt-3">Choose your plan</h1><p className="text-muted-foreground mt-2">Stripe-powered billing for the existing SaaS features.</p></div>
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => <Card key={plan.name}><CardHeader><CardTitle>{plan.name}</CardTitle><p className="text-sm text-muted-foreground">{plan.price}</p></CardHeader><CardContent className="space-y-4"><ul className="space-y-2 text-sm">{plan.features.map((f) => <li key={f}>• {f}</li>)}</ul><Button className="w-full" disabled={!plan.priceId || loading === plan.priceId} onClick={() => checkout(plan.priceId)}>{loading === plan.priceId ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.priceId ? "Continue to Stripe" : "Configure Stripe price ID"}</Button></CardContent></Card>)}
      </div>
    </div>
  );
}
