"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimulationPanelProps {
  scenarioId: string;
  scenarioTitle: string;
}

export function SimulationPanel({ scenarioId, scenarioTitle }: SimulationPanelProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `What if: ${scenarioTitle}`,
          category: "GENERAL",
          scenarioId,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Simulation failed");
      }

      toast({ title: "Simulation started", description: "Check your dashboard for results", variant: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          AI Simulation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Run an AI-powered simulation based on this scenario. Our multi-agent system will analyze
          multiple outcomes with evidence-based reasoning.
        </p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="text-xs">Revenue & Growth</Badge>
            <Badge variant="outline" className="text-xs">Risk & Compliance</Badge>
            <Badge variant="outline" className="text-xs">Customer & Retention</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="text-xs">Cashflow & Finance</Badge>
            <Badge variant="outline" className="text-xs">Market & Competitive</Badge>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={runSimulation}
          disabled={isSimulating}
        >
          {isSimulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Simulation...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Run Simulation
            </>
          )}
        </Button>

        <Button variant="outline" className="w-full" asChild>
          <Link href="/simulate">
            Create Custom Query <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
