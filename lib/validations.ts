import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createScenarioSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum([
    "PRICING",
    "CART_RECOVERY",
    "SUBSCRIPTION_CHURN",
    "MARKET_ENTRY",
    "DISPUTE_RISK",
    "CASHFLOW",
    "GROWTH",
    "CUSTOMER_RETENTION",
  ]),
  tags: z.array(z.string()).max(10),
  isPublic: z.boolean().default(false),
});

export const createBranchSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  probability: z.number().min(0).max(100),
});

export const createTimelineEventSchema = z.object({
  year: z.number().min(1800).max(2100),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  impact: z.string().min(10),
  probability: z.number().min(0).max(100),
});

export const simulationQuerySchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters").max(1000),
  category: z.enum([
    "PRICING", "CART_RECOVERY", "SUBSCRIPTION_CHURN", "MARKET_ENTRY",
    "DISPUTE_RISK", "CASHFLOW", "GROWTH", "CUSTOMER_RETENTION",
  ]),
  parameters: z.record(z.any()).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(2000),
});

export const createReportSchema = z.object({
  title: z.string().min(5).max(200),
  type: z.enum(["SCENARIO", "SIMULATION", "TREND", "COMPARISON"]),
});
