import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Eye, Heart, MessageCircle } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface UserBookmarksProps {
  bookmarks: Array<{
    id: string;
    scenario: {
      id: string;
      title: string;
      slug: string;
      category: string;
      viewCount: number;
      likeCount: number;
      _count: { comments: number; bookmarks: number };
      user?: { name: string | null } | null;
    };
  }>;
}

export function UserBookmarks({ bookmarks }: UserBookmarksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Bookmarks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookmarks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No bookmarks yet</p>
            <p className="text-sm mt-1">
              Bookmark scenarios you want to revisit later
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <Link
                key={bookmark.id}
                href={`/scenarios/${bookmark.scenario.slug}`}
              >
                <div className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {bookmark.scenario.category}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2">
                    {bookmark.scenario.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatNumber(bookmark.scenario.viewCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {formatNumber(bookmark.scenario.likeCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {bookmark.scenario._count.comments}
                    </span>
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
