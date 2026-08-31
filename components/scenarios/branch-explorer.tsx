"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GitBranch, ChevronDown, ChevronUp } from "lucide-react";
import { getProbabilityColor } from "@/lib/utils";

interface BranchExplorerProps {
  branches: Array<{
    id: string;
    title: string;
    description: string;
    probability: number;
    timeline?: Array<{
      id: string;
      year: number;
      title: string;
      description: string;
      impact: string;
      probability: number;
    }>;
  }>;
}

export function BranchExplorer({ branches }: BranchExplorerProps) {
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);

  if (branches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Branching Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No branches available for this scenario
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Branching Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {branches.map((branch, index) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedBranch(expandedBranch === branch.id ? null : branch.id)
              }
              className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <h3 className="font-semibold">{branch.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 ml-11">
                    {branch.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2 ml-11">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Probability</span>
                        <span className="font-medium">{branch.probability}%</span>
                      </div>
                      <Progress value={branch.probability} className="h-2" />
                    </div>
                    <Badge className={`${getProbabilityColor(branch.probability)} text-white`}>
                      {branch.probability >= 70
                        ? "Likely"
                        : branch.probability >= 50
                        ? "Possible"
                        : branch.probability >= 30
                        ? "Unlikely"
                        : "Remote"}
                    </Badge>
                  </div>
                </div>
                {expandedBranch === branch.id ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground ml-4" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground ml-4" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {expandedBranch === branch.id && branch.timeline && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 ml-11 border-l-2 border-muted pl-6 space-y-4">
                    {branch.timeline.map((event, eventIndex) => (
                      <div key={event.id} className="relative">
                        <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                        <div className="text-xs text-muted-foreground mb-1">
                          Year {event.year}
                        </div>
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <div className="mt-2 p-2 rounded bg-muted/50 text-sm">
                          <span className="font-medium">Impact: </span>
                          {event.impact}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            Event probability:
                          </span>
                          <Progress value={event.probability} className="w-24 h-1.5" />
                          <span className="text-xs font-medium">{event.probability}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
