import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, ArrowRight } from "lucide-react";

export async function PopularScenarios() {
  const scenarios = await prisma.scenario.findMany({
    where: { isPublic: true, status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
    take: 6,
    include: {
      user: { select: { name: true } },
      _count: { select: { branches: true } },
    },
  });

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Example Scenarios
            </h2>
            <p className="mt-2 text-muted-foreground">
              {scenarios.length} pre-built scenarios to try the simulator on
            </p>
          </div>
          <Link
            href="/scenarios"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <Link key={scenario.id} href={`/scenarios/${scenario.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{scenario.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {scenario.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {scenario.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5">
                      Example scenario
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <GitBranch className="h-3.5 w-3.5" />
                      {scenario._count.branches} branches
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}