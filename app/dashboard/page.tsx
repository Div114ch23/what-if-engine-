import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentSimulations } from "@/components/dashboard/recent-simulations";
import { PopularScenariosList } from "@/components/dashboard/popular-scenarios";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { CategoryDistribution } from "@/components/dashboard/category-distribution";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [
    totalScenarios,
    totalSimulations,
    publicScenarios,
    recentSimulations,
    popularScenarios,
    categoryStats,
  ] = await Promise.all([
    // Only count scenarios owned by this user
    prisma.scenario.count({
      where: {
        userId: session.user.id,
      },
    }),

    // Only count successful simulations
    prisma.simulation.count({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
    }),

    // Public scenarios owned by this user
    prisma.scenario.count({
      where: {
        userId: session.user.id,
        isPublic: true,
      },
    }),

    // Only show successful simulations in the dashboard
    prisma.simulation.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        scenario: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    }),

    // Popular public scenarios
    prisma.scenario.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        viewCount: "desc",
      },
      take: 6,
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true,
          },
        },
      },
    }),

    // Category distribution for public scenarios
    prisma.scenario.groupBy({
      by: ["category"],
      where: {
        isPublic: true,
      },
      _count: {
        category: true,
      },
    }),
  ]);

  const stats = {
    totalScenarios,
    totalSimulations,
    publicScenarios,
    recentSimulations,
    popularScenarios,
    categoryStats: categoryStats.map(
      (c: {
        category: string;
        _count: {
          category: number;
        };
      }) => ({
        category: c.category,
        count: c._count.category,
      })
    ),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={session.user} />

      <div className="grid gap-6 mt-8">
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RecentSimulations simulations={stats.recentSimulations} />

            <PopularScenariosList
              scenarios={stats.popularScenarios}
            />
          </div>

          <div className="space-y-6">
            <QuickActions />

            <CategoryDistribution
              stats={stats.categoryStats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}