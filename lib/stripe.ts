import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    description: "Explore public scenarios and run limited simulations",
    price: 0,
    features: [
      "View public scenarios",
      "Run 3 simulations per month",
      "Basic timeline explorer",
      "Community support",
    ],
    limits: {
      simulationsPerMonth: 3,
      scenariosCreated: 0,
      apiCalls: 0,
    },
  },
  premium: {
    name: "Premium",
    description: "Unlimited simulations, private scenarios, and advanced features",
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    price: 19,
    features: [
      "Unlimited simulations",
      "Create private scenarios",
      "Advanced AI analysis",
      "Export reports",
      "Priority support",
      "API access",
    ],
    limits: {
      simulationsPerMonth: -1, // unlimited
      scenariosCreated: -1,
      apiCalls: 1000,
    },
  },
  team: {
    name: "Team",
    description: "Collaborate with your team on complex simulations",
    stripePriceId: process.env.STRIPE_TEAM_PRICE_ID,
    price: 49,
    features: [
      "Everything in Premium",
      "Team collaboration",
      "Shared scenarios",
      "Admin dashboard",
      "SSO integration",
      "Dedicated support",
    ],
    limits: {
      simulationsPerMonth: -1,
      scenariosCreated: -1,
      apiCalls: 10000,
      teamMembers: 10,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
