"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Brain, GitBranch } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Agentic Decision Studio for Commerce
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl"
          >
            Simulate{" "}
            <span className="text-gradient">What If?</span>{" "}
            Business Decisions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl"
          >
            Pricing changes, cart recovery, subscription churn, dispute risk,
            cashflow shortfalls — five parallel AI agents analyze each decision
            from a different lens, then a synthesis agent turns their outputs
            into one scored recommendation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/simulate">
                Start Simulating <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/scenarios">Explore Scenarios</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl"
          >
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border bg-card">
              <Brain className="h-8 w-8 text-blue-500" />
              <h3 className="font-semibold">5 Parallel Agents</h3>
              <p className="text-sm text-muted-foreground">
                Revenue, Risk, Retention, Cashflow & Market — run concurrently
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border bg-card">
              <GitBranch className="h-8 w-8 text-purple-500" />
              <h3 className="font-semibold">Branching Outcomes</h3>
              <p className="text-sm text-muted-foreground">
                Best case, base case, worst case — scored and ranked
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl border bg-card">
              <Sparkles className="h-8 w-8 text-green-500" />
              <h3 className="font-semibold">Conflict-Resolved</h3>
              <p className="text-sm text-muted-foreground">
                A synthesis agent reconciles disagreement into one call
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
      </div>
    </section>
  );
}
