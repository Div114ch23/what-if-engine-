"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, Brain, GitBranch, BookOpen, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "PRICING",
  "CART_RECOVERY",
  "SUBSCRIPTION_CHURN",
  "MARKET_ENTRY",
  "DISPUTE_RISK",
  "CASHFLOW",
  "GROWTH",
  "CUSTOMER_RETENTION",
];

const exampleQueries = [
  "What if we raised premium subscription price by 12%?",
  "What if we auto-nudged abandoned carts via WhatsApp within 15 minutes?",
  "What if we auto-contested chargebacks with AI-compiled evidence?",
  "What if we forecasted cashflow 7 days ahead to avoid payout shortfalls?",
  "What if we entered a new market with a localized pricing tier?",
];

interface SimulationResult {
  analysis: string;
  branches: Array<{
    title: string;
    description: string;
    probability: number;
    timeline: Array<{
      year: number;
      title: string;
      description: string;
      impact: string;
    }>;
  }>;
  evidence: Array<{
    title: string;
    source: string;
    summary: string;
    credibility: number;
  }>;
  confidence: number;
  keyInsights: string[];
  risks: string[];
  opportunities: string[];
  agentTrace: Array<{
    agentId: string; agentName: string; stance: string; confidence: number; summary: string;
    supportingPoints: string[]; flaggedRisks: string[]; flaggedOpportunities: string[];
  }>;
}

export function SimulationEngine() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const { toast } = useToast();

  const runSimulation = async () => {
    if (!query.trim() || !category) {
      toast({ title: "Missing fields", description: "Please enter a query and select a category", variant: "destructive" });
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const res = await fetch("/api/simulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, category }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Simulation failed");
      }

      const data = await res.json();
      setResult(data.result as SimulationResult);
      toast({ title: "Simulation complete", variant: "success" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">Your &quot;What If?&quot; Question</Label>
            <Textarea
              id="query"
              placeholder="What if..."
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                className="w-full"
                size="lg"
                onClick={runSimulation}
                disabled={isRunning}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Run Simulation
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-2">Try:</span>
            {exampleQueries.map((q) => (
              <button
                key={q}
                onClick={() => setQuery(q)}
                className="text-xs text-primary hover:underline"
              >
                {q.length > 40 ? q.substring(0, 40) + "..." : q}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center py-12 space-y-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Brain className="absolute inset-0 m-auto h-6 w-6 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">Running 5 Agents in Parallel</h3>
                <p className="text-sm text-muted-foreground">
                  Revenue • Risk • Retention • Cashflow • Market
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <Progress value={45} className="animate-pulse" />
                <p className="text-xs text-center text-muted-foreground">
                  Synthesizing agent outputs into one scored recommendation...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Tabs defaultValue="analysis" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="branches">Branches</TabsTrigger>
                <TabsTrigger value="evidence">Agent Signals</TabsTrigger>
                <TabsTrigger value="agents">Decision Council</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      AI Analysis
                      <Badge variant="secondary">Confidence: {result.confidence}%</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-lg leading-relaxed whitespace-pre-wrap">
                        {result.analysis}
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Confidence</span>
                        <span className="font-medium">{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="branches" className="space-y-4">
                {result.branches.map((branch, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <GitBranch className="h-5 w-5" />
                        Branch {String.fromCharCode(65 + index)}: {branch.title}
                        <Badge>{branch.probability}% probability</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{branch.description}</p>
                      <Progress value={branch.probability} className="h-2" />
                      
                      <Accordion type="single" collapsible>
                        <AccordionItem value="timeline">
                          <AccordionTrigger>Timeline Events</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              {branch.timeline.map((event, i) => (
                                <div key={i} className="border-l-2 border-primary pl-4 py-2">
                                  <Badge variant="outline" className="mb-1">Year {event.year}</Badge>
                                  <h4 className="font-medium">{event.title}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                  <p className="text-sm mt-2"><span className="font-medium">Projected Impact:</span> {event.impact}</p>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Agent Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.evidence.map((item, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Source agent: {item.source}</p>
                        <p className="text-sm mt-2">{item.summary}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Credibility</span>
                              <span>{item.credibility}/10</span>
                            </div>
                            <Progress value={item.credibility * 10} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Decision Council</CardTitle>
                    <p className="text-sm text-muted-foreground">Five specialized agents independently evaluate this decision before the synthesis agent makes a call. Their reasoning and disagreement are shown here, not hidden.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.agentTrace.map((agent) => (
                      <div key={agent.agentId} className="rounded-lg border p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-semibold">{agent.agentName}</div>
                          <div className="flex gap-2"><Badge variant="outline">{agent.stance}</Badge><Badge variant="secondary">{agent.confidence}% confidence</Badge></div>
                        </div>
                        <p className="text-sm text-muted-foreground">{agent.summary}</p>
                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div><p className="font-medium mb-1">Signals</p>{agent.supportingPoints.slice(0, 3).map((x, i) => <p key={i}>• {x}</p>)}</div>
                          <div><p className="font-medium mb-1">Risks</p>{agent.flaggedRisks.slice(0, 3).map((x, i) => <p key={i}>• {x}</p>)}</div>
                          <div><p className="font-medium mb-1">Opportunities</p>{agent.flaggedOpportunities.slice(0, 3).map((x, i) => <p key={i}>• {x}</p>)}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.keyInsights.map((insight, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-yellow-500">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Risks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.risks.map((risk, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-red-500">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.opportunities.map((opp, i) => (
                          <li key={i} className="text-sm flex gap-2">
                            <span className="text-green-500">•</span>
                            {opp}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
