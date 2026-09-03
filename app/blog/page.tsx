import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Blog — What If? Engine",
  description: "Updates on What If? Engine.",
};

const posts = [
  {
    title: "Building What If? Engine for the Razorpay AI Buildathon",
    date: "September 2026",
    excerpt:
      "Why we built a decision layer instead of another dashboard — and how five parallel agents plus a synthesis step turn merchant payment signals into one accountable recommendation.",
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <Badge>What If? Engine</Badge>
      <h1 className="text-4xl font-bold mt-4 mb-2">Blog</h1>
      <p className="text-muted-foreground mb-10">
        Notes on building an agentic decision layer for merchants.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post.title}>
            <CardHeader>
              <p className="text-xs text-muted-foreground">{post.date}</p>
              <CardTitle className="text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
