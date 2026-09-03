"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Brain, GitBranch } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 lg:pt-32 pb-8 lg:pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Agentic Decision Studio for Merchants
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl"
          >
            Turn Payment Signals Into{" "}
            <span className="text-gradient">Growth Decisions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-2xl"
          >
            What If? Engine is an agentic decision platform for merchants. It
            analyzes Razorpay payment signals, simulates business outcomes, and
            recommends the next action — with merchant approval and safety
            controls at every step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/growth">
                Open Growth Studio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/simulate">Explore Simulations</Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-xs text-muted-foreground tracking-wide uppercase"
          >
            Built with Razorpay Test Mode &middot; Multi-Agent AI &middot; Human-in-the-loop
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 w-full max-w-3xl"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-6">
              How the engine thinks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
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