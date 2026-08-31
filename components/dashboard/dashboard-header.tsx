"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, Sparkles, Crown } from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name || "Explorer"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your simulations
        </p>
      </div>
      <div className="flex gap-3">
        {user.role !== "PREMIUM" && user.role !== "ADMIN" && (
          <Button variant="outline" asChild>
            <Link href="/pricing">
              <Crown className="mr-2 h-4 w-4 text-yellow-500" />
              Upgrade
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link href="/scenarios/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Scenario
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/simulate">
            <Sparkles className="mr-2 h-4 w-4" />
            Simulate
          </Link>
        </Button>
      </div>
    </div>
  );
}
