import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileHeader } from "@/components/profile/profile-header";
import { UserScenarios } from "@/components/profile/user-scenarios";
import { UserSimulations } from "@/components/profile/user-simulations";
import { UserBookmarks } from "@/components/profile/user-bookmarks";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const [user, scenarios, simulations, bookmarks] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    }),
    prisma.scenario.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { comments: true, bookmarks: true } } },
    }),
    prisma.simulation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { scenario: { select: { title: true } } },
    }),
    prisma.bookmark.findMany({
      where: { userId: session.user.id },
      include: {
        scenario: {
          include: {
            user: { select: { name: true } },
            _count: { select: { comments: true, bookmarks: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-8">
          <UserScenarios scenarios={scenarios} />
          <UserSimulations simulations={simulations} />
        </div>
        <div>
          <UserBookmarks bookmarks={bookmarks} />
        </div>
      </div>
    </div>
  );
}
