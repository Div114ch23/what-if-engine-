import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserSimulationsProps {
  simulations: Array<{
    id: string;
    query: string;
    status: string;
    confidence: number;
    createdAt: Date;
    scenario?: { title: string } | null;
  }>;
}

export function UserSimulations({ simulations }: UserSimulationsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "PROCESSING":
        return <Badge variant="secondary">Processing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          Recent Simulations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {simulations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No simulations run yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{sim.query}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {getStatusBadge(sim.status)}
                    <span>{formatDate(sim.createdAt)}</span>
                    {sim.confidence > 0 && (
                      <span>Confidence: {sim.confidence}%</span>
                    )}
                    {sim.scenario && (
                      <span>Scenario: {sim.scenario.title}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
