"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldCheck, TrendingUp, CreditCard, IndianRupee, Zap, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Metrics = {
  orderCount: number;
  paidOrderCount: number;
  failedPaymentCount: number;
  successfulPaymentCount: number;
  paymentAttempts: number;
  successRate: number;
  grossOrderValue: number;
  capturedRevenue: number;
  failedValue: number;
  averageOrderValue: number;
  refundedValue: number;
  paymentMethodMix: Record<string, number>;
  currency: string;
  periodLabel: string;
};

type Plan = {
  recommendation: string;
  action: "RECOVER" | "UPSELL" | "OPTIMIZE_CHECKOUT" | "DO_NOTHING";
  rationale: string[];
  expectedImpact: { revenueLiftPercent: number; confidence: number };
  guardrails: string[];
  testOfferAmount: number;
};

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function GrowthStudio() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [executing, setExecuting] = useState(false);
  const [testOrder, setTestOrder] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/razorpay/merchant")
      .then(async (r) => {
        const data = await r.json();
        setMetrics(data.metrics);
        setConnected(Boolean(data.connected));
        setMessage(data.message || "");
      })
      .catch(() => setMessage("Could not load merchant data."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!document.getElementById("razorpay-checkout-js")) {
      const script = document.createElement("script");
      script.id = "razorpay-checkout-js";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const analyze = async () => {
    if (!metrics) return;
    setAnalyzing(true);
    try {
      const response = await fetch("/api/razorpay/growth-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Analysis failed");
      setPlan(data);
    } catch (error: any) {
      toast({ title: "Agent error", description: error.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const executeBoundedTest = async () => {
    if (!plan || plan.action === "DO_NOTHING") return;
    setExecuting(true);
    try {
      const response = await fetch("/api/razorpay/test-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.testOfferAmount, confirmed: true, action: plan.action }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Test order failed");
      setTestOrder(data);
      toast({ title: "Bounded TEST action created", description: `Razorpay order ${data.orderId} is ready.` });

      const openCheckout = () => {
        if (!window.Razorpay) return;
        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: "What If? Engine",
          description: `AI Growth ${plan.action} — TEST MODE`,
          order_id: data.orderId,
          handler: () => toast({ title: "Test payment completed", description: "No real money was moved." }),
          theme: { color: "#111827" },
        });
        rzp.on("payment.failed", () => toast({ title: "Test payment failed", description: "Failure handled safely in test mode.", variant: "destructive" }));
        rzp.open();
      };
      if (window.Razorpay) openCheckout();
      else setTimeout(openCheckout, 800);
    } catch (error: any) {
      toast({ title: "Action blocked", description: error.message, variant: "destructive" });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  if (!metrics) return <Alert variant="destructive"><AlertTitle>Merchant data unavailable</AlertTitle><AlertDescription>Configure Razorpay test credentials and reload.</AlertDescription></Alert>;

  return (
    <div className="space-y-6">
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertTitle>Test-mode only · bounded actions</AlertTitle>
        <AlertDescription>
          {connected ? "Connected to Razorpay test-mode data." : "Using a clearly labelled synthetic dataset until Razorpay test keys are configured."} {message}
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Orders", metrics.orderCount.toString(), CreditCard],
          ["Payment success", `${metrics.successRate}%`, TrendingUp],
          ["Captured revenue", rupees(metrics.capturedRevenue), IndianRupee],
          ["Failed value", rupees(metrics.failedValue), Zap],
        ].map(([label, value, Icon]: any) => (
          <Card key={label as string}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><Icon className="h-4 w-4" /></div>
              <div className="text-2xl font-bold mt-2">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Merchant signal</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm"><span>Successful orders</span><span>{metrics.paidOrderCount}/{metrics.orderCount}</span></div>
          <Progress value={metrics.successRate} />
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div><p className="text-muted-foreground">Average order</p><p className="font-semibold">{rupees(metrics.averageOrderValue)}</p></div>
            <div><p className="text-muted-foreground">Refunded value</p><p className="font-semibold">{rupees(metrics.refundedValue)}</p></div>
            <div><p className="text-muted-foreground">Payment attempts</p><p className="font-semibold">{metrics.paymentAttempts}</p></div>
          </div>
          <p className="text-xs text-muted-foreground">{metrics.periodLabel}</p>
          <Button onClick={analyze} disabled={analyzing} size="lg">
            {analyzing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Growth Agent analyzing…</> : <><TrendingUp className="mr-2 h-4 w-4" />Run Growth Agent</>}
          </Button>
        </CardContent>
      </Card>

      {plan && (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2"><CardTitle>Agent recommendation</CardTitle><Badge>{plan.action}</Badge><Badge variant="secondary">{plan.expectedImpact.confidence}% confidence</Badge></div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-lg leading-relaxed">{plan.recommendation}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div><h3 className="font-semibold mb-2">Why</h3><ul className="space-y-2 text-sm">{plan.rationale.map((x, i) => <li key={i}>• {x}</li>)}</ul></div>
              <div><h3 className="font-semibold mb-2">Guardrails</h3><ul className="space-y-2 text-sm">{plan.guardrails.map((x, i) => <li key={i}>• {x}</li>)}</ul></div>
            </div>
            <div className="rounded-lg border p-4 flex flex-wrap items-center justify-between gap-4">
              <div><p className="text-sm text-muted-foreground">Estimated lift</p><p className="font-bold text-xl">{plan.expectedImpact.revenueLiftPercent}%</p></div>
              <div><p className="text-sm text-muted-foreground">Bounded test amount</p><p className="font-bold text-xl">{rupees(plan.testOfferAmount / 100)}</p></div>
              <Button onClick={executeBoundedTest} disabled={executing || !connected || plan.action === "DO_NOTHING"}>
                {executing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Execute TEST action
              </Button>
            </div>
            {!connected && <p className="text-xs text-muted-foreground">Execution is disabled until a Razorpay rzp_test_ key pair is configured.</p>}
            {testOrder && <div className="text-sm rounded-md bg-muted p-3 flex items-center gap-2"><Badge variant="outline">TEST</Badge> Order created: <code>{testOrder.orderId}</code> <ExternalLink className="h-3 w-3" /></div>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
