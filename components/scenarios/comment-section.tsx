"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface CommentSectionProps {
  scenarioId: string;
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user?: { name: string | null; image: string | null } | null;
  }>;
  userId?: string;
}

export function CommentSection({ scenarioId, comments, userId }: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!userId) {
      toast({ title: "Sign in required", description: "Please sign in to comment" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId, content }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      setContent("");
      toast({ title: "Comment posted", variant: "success" });
      window.location.reload();
    } catch {
      toast({ title: "Error", description: "Failed to post comment", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Discussion ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {userId ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              placeholder="Share your thoughts on this scenario..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting || !content.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">
              <Link href="/auth/signin" className="text-primary hover:underline">
                Sign in
              </Link>{" "}
              to join the discussion
            </p>
          </div>
        )}

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-3 rounded-lg hover:bg-muted/30">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user?.image || ""} />
                  <AvatarFallback>{comment.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.user?.name || "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
