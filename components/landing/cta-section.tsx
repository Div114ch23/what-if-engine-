"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-16 text-center text-white"
        >
          <div className="relative z-10">
            <Zap className="h-12 w-12 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Simulate Your Next Decision?
            </h2>
            <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
              Run pricing, recovery, and risk decisions through five parallel
              agents before you commit. Free to explore, premium for power users.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/simulate">
                  Start Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link href="/scenarios">Browse Scenarios</Link>
              </Button>
            </div>
          </div>

          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
