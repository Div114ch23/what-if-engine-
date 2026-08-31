import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, ExternalLink, Shield } from "lucide-react";

interface EvidencePanelProps {
  evidence: Array<{
    id: string;
    title: string;
    source: string;
    url: string | null;
    summary: string;
    credibility: number;
    relevance: number;
  }>;
}

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  if (evidence.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Evidence & Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No evidence sources available for this scenario
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Evidence & Sources
          <Badge variant="secondary">{evidence.length} sources</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {evidence.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg border hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {item.source}
                  </span>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Source
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {item.summary}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Credibility</span>
                  <span>{item.credibility}/10</span>
                </div>
                <Progress value={item.credibility * 10} className="h-1.5" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Relevance</span>
                  <span>{item.relevance}/10</span>
                </div>
                <Progress value={item.relevance * 10} className="h-1.5" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
