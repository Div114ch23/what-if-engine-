import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, Heart, MessageCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface PopularScenariosListProps {
  scenarios: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    viewCount: number;
    likeCount: number;
    _count: { comments: number };
    user?: { name: string | null } | null;
  }>;
}

export function PopularScenariosList({ scenarios }: PopularScenariosListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending in Community
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scenarios.map((scenario, index) => (
            <Link key={scenario.id} href={`/scenarios/${scenario.slug}`}>
              <div className="flex items-start gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {scenario.category}
                    </Badge>
                  </div>
                  <p className="font-medium text-sm mt-1 line-clamp-1">
                    {scenario.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(scenario.viewCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(scenario.likeCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {scenario._count.comments}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
