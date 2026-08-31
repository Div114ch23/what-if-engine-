"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { History, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimelineViewerProps {
  branches: Array<{
    id: string;
    title: string;
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

export function TimelineViewer({ branches }: TimelineViewerProps) {
  const [selectedBranch, setSelectedBranch] = useState(branches[0]?.id || "");

  const activeBranch = branches.find((b) => b.id === selectedBranch);
  const allEvents = branches.flatMap((b) =>
    (b.timeline || []).map((t) => ({ ...t, branchTitle: b.title, branchId: b.id }))
  ).sort((a, b) => a.year - b.year);

  const viewOptions = [
    { value: "all", label: "All Branches" },
    ...branches.map((b) => ({ value: b.id, label: b.title })),
  ];

  const displayEvents =
    selectedBranch === "all" || !selectedBranch
      ? allEvents
      : (activeBranch?.timeline || []).map((t) => ({
          ...t,
          branchTitle: activeBranch?.title || "",
          branchId: activeBranch?.id || "",
        }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Timeline Explorer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {viewOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {displayEvents.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No timeline events available
          </p>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {displayEvents.map((event, index) => (
                <div key={event.id || index} className="relative pl-12">
                  <div className="absolute left-2 top-1.5 h-5 w-5 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-1">
                    <Badge variant="outline" className="font-mono">
                      {event.year}
                    </Badge>
                    {selectedBranch === "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {event.branchTitle}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 max-w-[200px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Confidence</span>
                        <span>{event.probability}%</span>
                      </div>
                      <Progress value={event.probability} className="h-1.5" />
                    </div>
                  </div>
                  <div className="mt-2 p-2 rounded-md bg-muted/50 text-sm">
                    <span className="font-medium">Impact: </span>
                    {event.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
