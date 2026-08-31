import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FlaskConical, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface RecentSimulationsProps {
  simulations: Array<{
    id: string;
    query: string;
    status: string;
    createdAt: Date;
    scenario?: { title: string; slug: string } | null;
  }>;
}

export function RecentSimulations({ simulations }: RecentSimulationsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "PROCESSING":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
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
            <p>No simulations yet. Run your first one!</p>
            <Link
              href="/simulate"
              className="text-primary hover:underline text-sm mt-2 inline-block"
            >
              Start simulating →
            </Link>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {simulations.map((sim) => (
                <div
                  key={sim.id}
                  className="flex items-start justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{sim.query}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(sim.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(sim.createdAt)}
                      </span>
                      {sim.scenario && (
                        <Link
                          href={`/scenarios/${sim.scenario.slug}`}
                          className="text-xs text-primary hover:underline"
                        >
                          {sim.scenario.title}
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">{getStatusBadge(sim.status)}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
