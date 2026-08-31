import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ScenarioFilters } from "@/components/scenarios/scenario-filters";
import { ScenarioGrid } from "@/components/scenarios/scenario-grid";
import { ScenarioSearch } from "@/components/scenarios/scenario-search";
import { ScenarioSkeleton } from "@/components/scenarios/scenario-skeleton";

interface ScenariosPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
  };
}

export default async function ScenariosPage({ searchParams }: ScenariosPageProps) {
  const where: any = { isPublic: true, status: "PUBLISHED" };

  if (searchParams.category && searchParams.category !== "ALL") {
    where.category = searchParams.category;
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      { tags: { has: searchParams.search } },
    ];
  }

  const orderBy: any =
    searchParams.sort === "popular"
      ? { viewCount: "desc" }
      : searchParams.sort === "likes"
      ? { likeCount: "desc" }
      : { createdAt: "desc" };

  const scenarios = await prisma.scenario.findMany({
    where,
    orderBy,
    include: {
      user: { select: { name: true, image: true } },
      _count: { select: { comments: true, bookmarks: true, branches: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Scenarios</h1>
        <p className="text-muted-foreground mt-2">
          Discover pricing, cart-recovery, dispute-risk, and cashflow decision simulations
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <ScenarioSearch />
        <ScenarioFilters />
      </div>

      <Suspense fallback={<ScenarioSkeleton count={9} />}>
        <ScenarioGrid scenarios={scenarios} />
      </Suspense>
    </div>
  );
}
