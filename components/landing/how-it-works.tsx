"use client";

import { motion } from "framer-motion";
import { Search, Brain, GitBranch, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Describe the Decision",
    description:
      'Type any business decision — from "What if we raised premium pricing 12%?" to "What if we auto-contested chargebacks?"',
  },
  {
    icon: Brain,
    title: "5 Agents Run in Parallel",
    description:
      "Revenue, Risk, Retention, Cashflow, and Market agents each analyze the decision independently and concurrently.",
  },
  {
    icon: GitBranch,
    title: "Synthesis Resolves Conflicts",
    description:
      "A synthesis agent weighs where the five agents agree or disagree into one scored recommendation.",
  },
  {
    icon: BarChart3,
    title: "Review Branches & Evidence",
    description:
      "Explore best/base/worst-case branches with confidence scores and per-agent supporting evidence.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            From question to insight in four steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
