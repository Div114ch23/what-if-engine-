import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, MessageCircle, GitBranch } from "lucide-react";
import { formatNumber, truncateText } from "@/lib/utils";

interface ScenarioGridProps {
  scenarios: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    tags: string[];
    viewCount: number;
    likeCount: number;
    _count: { comments: number; bookmarks: number; branches: number };
    user?: { name: string | null; image: string | null } | null;
  }>;
}

export function ScenarioGrid({ scenarios }: ScenarioGridProps) {
  if (scenarios.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-lg">No scenarios found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scenarios.map((scenario) => (
        <Link key={scenario.id} href={`/scenarios/${scenario.slug}`}>
          <Card className="h-full hover:shadow-lg transition-all group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary">{scenario.category}</Badge>
                {scenario.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                {scenario.title}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {truncateText(scenario.description, 120)}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {formatNumber(scenario.viewCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5" />
                  {formatNumber(scenario.likeCount)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {scenario._count.comments}
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="h-3.5 w-3.5" />
                  {scenario._count.branches}
                </span>
              </div>
              {scenario.user?.name && (
                <p className="text-xs text-muted-foreground mt-3">
                  by {scenario.user.name}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
