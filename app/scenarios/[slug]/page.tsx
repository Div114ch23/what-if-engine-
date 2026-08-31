import { notFound } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ScenarioDetail } from "@/components/scenarios/scenario-detail";
import { BranchExplorer } from "@/components/scenarios/branch-explorer";
import { TimelineViewer } from "@/components/scenarios/timeline-viewer";
import { EvidencePanel } from "@/components/scenarios/evidence-panel";
import { CommentSection } from "@/components/scenarios/comment-section";
import { SimulationPanel } from "@/components/scenarios/simulation-panel";

interface ScenarioPageProps {
  params: { slug: string };
}

export default async function ScenarioPage({ params }: ScenarioPageProps) {
  const session = await getServerSession(authOptions);

  const scenario = await prisma.scenario.findUnique({
    where: { slug: params.slug },
    include: {
      user: { select: { id: true, name: true, image: true } },
      branches: {
        orderBy: { orderIndex: "asc" },
        include: {
          timeline: { orderBy: { orderIndex: "asc" } },
        },
      },
      evidence: { orderBy: { credibility: "desc" } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } },
        take: 20,
      },
      _count: { select: { bookmarks: true, comments: true } },
    },
  });

  if (!scenario) {
    notFound();
  }

  // Increment view count
  await prisma.scenario.update({
    where: { id: scenario.id },
    data: { viewCount: { increment: 1 } },
  });

  const isBookmarked = session?.user
    ? !!(await prisma.bookmark.findUnique({
        where: {
          userId_scenarioId: { userId: session.user.id, scenarioId: scenario.id },
        },
      }))
    : false;

  return (
    <div className="container mx-auto px-4 py-8">
      <ScenarioDetail scenario={scenario} isBookmarked={isBookmarked} userId={session?.user?.id} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <BranchExplorer branches={scenario.branches} />
          <TimelineViewer branches={scenario.branches} />
          <EvidencePanel evidence={scenario.evidence} />
          <CommentSection scenarioId={scenario.id} comments={scenario.comments} userId={session?.user?.id} />
        </div>
        <div className="space-y-6">
          <SimulationPanel scenarioId={scenario.id} scenarioTitle={scenario.title} />
        </div>
      </div>
    </div>
  );
}
