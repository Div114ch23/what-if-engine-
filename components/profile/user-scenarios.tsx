import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Heart, MessageCircle, PlusCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface UserScenariosProps {
  scenarios: Array<{
    id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    isPublic: boolean;
    viewCount: number;
    likeCount: number;
    _count: { comments: number; bookmarks: number };
  }>;
}

export function UserScenarios({ scenarios }: UserScenariosProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Your Scenarios
        </CardTitle>
        <Button size="sm" asChild>
          <Link href="/scenarios/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {scenarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No scenarios created yet</p>
            <Button variant="link" asChild className="mt-2">
              <Link href="/scenarios/new">Create your first scenario</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <Link key={scenario.id} href={`/scenarios/${scenario.slug}`}>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{scenario.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {scenario.category}
                      </Badge>
                      <Badge
                        variant={scenario.isPublic ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {scenario.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
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
        )}
      </CardContent>
    </Card>
  );
}
