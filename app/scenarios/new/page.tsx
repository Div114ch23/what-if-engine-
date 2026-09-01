import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ScenarioCreator } from "@/components/scenarios/scenario-creator";

export default async function NewScenarioPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Scenario</h1>
        <p className="text-muted-foreground mt-2">
             Define a &ldquo;What If?&rdquo; question and explore its possible outcomes
        </p>
      </div>
      <ScenarioCreator />
    </div>
  );
}
