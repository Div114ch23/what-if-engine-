"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, Eye, Heart, MessageCircle } from "lucide-react";
import { formatDate, formatNumber } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ScenarioDetailProps {
  scenario: {
    id: string;
    title: string;
    description: string;
    category: string;
    tags: string[];
    status: string;
    isPublic: boolean;
    viewCount: number;
    likeCount: number;
    createdAt: Date;
    user?: { id: string; name: string | null; image: string | null } | null;
    _count?: { bookmarks: number; comments: number };
  };
  isBookmarked: boolean;
  userId?: string;
}

export function ScenarioDetail({ scenario, isBookmarked, userId }: ScenarioDetailProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [likeCount, setLikeCount] = useState(scenario.likeCount);

  const handleBookmark = async () => {
    if (!userId) {
      toast({ title: "Sign in required", description: "Please sign in to bookmark scenarios" });
      return;
    }

    try {
      const res = await fetch(`/api/scenarios/${scenario.id}/bookmark`, { method: "POST" });
      const data = await res.json();
      setBookmarked(data.bookmarked);
      setLikeCount((prev) => (data.bookmarked ? prev + 1 : prev - 1));
      toast({
        title: data.bookmarked ? "Bookmarked" : "Removed bookmark",
        variant: "success",
      });
      router.refresh();
    } catch {
      toast({ title: "Error", description: "Failed to update bookmark", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied", description: "Scenario link copied to clipboard", variant: "success" });
    } catch {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-sm">
          {scenario.category}
        </Badge>
        {scenario.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{scenario.title}</h1>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {scenario.user?.name && <span>by {scenario.user.name}</span>}
        <span>{formatDate(scenario.createdAt)}</span>
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {formatNumber(scenario.viewCount)}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          {formatNumber(likeCount)}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          {scenario._count?.comments || 0}
        </span>
      </div>

      <p className="text-lg text-muted-foreground leading-relaxed">{scenario.description}</p>

      <div className="flex gap-3">
        <Button
          variant={bookmarked ? "default" : "outline"}
          size="sm"
          onClick={handleBookmark}
        >
          <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
          {bookmarked ? "Bookmarked" : "Bookmark"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
