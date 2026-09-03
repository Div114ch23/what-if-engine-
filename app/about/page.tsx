import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ShieldCheck, GitBranch } from "lucide-react";

export const metadata = {
  title: "About — What If? Engine",
  description: "What What If? Engine is and why it exists.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Badge>What If? Engine</Badge>
      <h1 className="text-4xl font-bold mt-4 mb-6">About this project</h1>

      <div className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <p>
          What If? Engine is an agentic decision platform for merchants,
          built for the Razorpay AI Buildathon. Every merchant already has
          payment data — orders, failures, refunds, payment-method mix. The
          harder question is what to actually do with it.
        </p>
        <p>
          Instead of a single model guessing at an answer, five specialized
          agents — Revenue, Risk, Retention, Cashflow, and Market — evaluate
          a decision independently and in parallel. A Synthesis Agent then
          resolves any disagreement between them into one recommendation,
          with its reasoning shown, not hidden.
        </p>
        <p>
          No action is ever taken automatically. Every recommendation
          requires explicit merchant approval, and every executable action is
          bounded to Razorpay Test Mode within a fixed rupee limit, logged to
          an audit trail.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-10">
        <Card>
          <CardContent className="pt-6 space-y-2">
            <Brain className="h-6 w-6 text-blue-500" />
            <p className="font-semibold text-sm">5 parallel agents</p>
            <p className="text-xs text-muted-foreground">One decision, five independent perspectives.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-2">
            <GitBranch className="h-6 w-6 text-purple-500" />
            <p className="font-semibold text-sm">Synthesized, not averaged</p>
            <p className="text-xs text-muted-foreground">Disagreement is resolved, then explained.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-2">
            <ShieldCheck className="h-6 w-6 text-green-500" />
            <p className="font-semibold text-sm">Human-in-the-loop</p>
            <p className="text-xs text-muted-foreground">Merchant approval before any bounded action.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
