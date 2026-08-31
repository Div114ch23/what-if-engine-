import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { GrowthStudio } from "@/components/growth/growth-studio";

export default async function GrowthPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex rounded-full border px-3 py-1 text-xs font-medium mb-4">RAZORPAY AI BUILDATHON · AI GROWTH & AGENTIC COMMERCE</div>
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Merchant Growth Studio</h1>
        <p className="text-muted-foreground mt-3 max-w-3xl text-lg">
          Connect Razorpay test-mode data, let an AI growth agent diagnose revenue leakage, and execute one explicitly gated, bounded test action.
        </p>
      </div>
      <GrowthStudio />
    </div>
  );
}
