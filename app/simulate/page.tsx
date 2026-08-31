import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SimulationEngine } from "@/components/simulate/simulation-engine";

export default async function SimulatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">
          What If? Engine
        </h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl mx-auto">
          Describe any business decision — pricing, cart recovery, subscription churn, dispute risk, cashflow. Five parallel AI agents simulate the outcomes with evidence-based analysis.
        </p>
      </div>
      <SimulationEngine />
    </div>
  );
}
