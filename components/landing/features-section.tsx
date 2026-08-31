"use client";

import { motion } from "framer-motion";
import {
  Tag,
  ShoppingCart,
  Repeat,
  Globe,
  ShieldAlert,
  Wallet,
  TrendingUp,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Tag,
    title: "Pricing",
    description: "Model churn and revenue impact before changing a price.",
  },
  {
    icon: ShoppingCart,
    title: "Cart Recovery",
    description: "Simulate recovery-channel and timing changes before rollout.",
  },
  {
    icon: Repeat,
    title: "Subscription Churn",
    description: "Forecast the impact of retention offers and win-back flows.",
  },
  {
    icon: Globe,
    title: "Market Entry",
    description: "Weigh competitive response and timing for new markets.",
  },
  {
    icon: ShieldAlert,
    title: "Dispute Risk",
    description: "Evaluate automated chargeback and fraud-response strategies.",
  },
  {
    icon: Wallet,
    title: "Cashflow",
    description: "Stress-test payout timing and working-capital decisions.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    description: "Simulate expansion bets before committing budget.",
  },
  {
    icon: Users,
    title: "Customer Retention",
    description: "Model loyalty and experience trade-offs at scale.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight">
            Simulate Any Commerce Decision
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Our specialized agents cover the decisions that actually move
            revenue and risk in a payments-driven business.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group p-6 rounded-xl border bg-card hover:shadow-lg transition-all"
            >
              <feature.icon className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
