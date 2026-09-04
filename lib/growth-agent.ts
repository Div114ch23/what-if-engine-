import { generateGeminiText } from "@/lib/gemini";
import { z } from "zod";
import type { MerchantMetrics } from "@/lib/merchant-analytics";

const planSchema = z.object({
  recommendation: z.string().min(1).max(1200),

  action: z.enum([
    "RECOVER",
    "UPSELL",
    "OPTIMIZE_CHECKOUT",
    "DO_NOTHING",
  ]),

  rationale: z.array(z.string()).min(2).max(5),

  expectedImpact: z.object({
    revenueLiftPercent: z.number().min(-100).max(100),
    confidence: z.number().min(0).max(100),
  }),

  guardrails: z.array(z.string()).min(2).max(6),

  testOfferAmount: z.number().int().min(100).max(1000000),
});

function parseJson(text: string) {
  const cleaned = text.trim();

  const fenced = cleaned.match(
    /```(?:json)?\s*([\s\S]*?)\s*```/i
  );

  const jsonText = fenced ? fenced[1].trim() : cleaned;

  return JSON.parse(jsonText);
}

function fallbackPlan(metrics: MerchantMetrics) {
  if (metrics.failedPaymentCount > 0) {
    return {
      recommendation:
        "Prioritize recovery of failed payments with a small bounded TEST MODE recovery flow.",
      action: "RECOVER" as const,
      rationale: [
        `${metrics.failedPaymentCount} failed payment attempt(s) are visible in the supplied merchant data.`,
        "Recovering failed payments is more directly supported by the available data than introducing a larger new offer.",
      ],
      expectedImpact: {
        revenueLiftPercent: 3,
        confidence: 55,
      },
      guardrails: [
        "Run only in Razorpay TEST MODE.",
        "Use a small bounded test amount.",
        "Do not treat the estimate as guaranteed revenue.",
      ],
      testOfferAmount: Math.min(
        Math.max(metrics.averageOrderValue || 49900, 100),
        1000000
      ),
    };
  }

  if (metrics.paidOrderCount > 0) {
    return {
      recommendation:
        "Test a small upsell against the existing successful-order base.",
      action: "UPSELL" as const,
      rationale: [
        `${metrics.paidOrderCount} successful order(s) are present in the supplied data.`,
        "A small upsell test is bounded and can be evaluated before any broader rollout.",
      ],
      expectedImpact: {
        revenueLiftPercent: 2,
        confidence: 50,
      },
      guardrails: [
        "Run only in Razorpay TEST MODE.",
        "Keep the test amount small and bounded.",
        "Do not treat the estimate as guaranteed revenue.",
      ],
      testOfferAmount: Math.min(
        Math.max(metrics.averageOrderValue || 49900, 100),
        1000000
      ),
    };
  }

  return {
    recommendation:
      "Do not make a growth intervention yet because the current dataset is too small to justify one.",
    action: "DO_NOTHING" as const,
    rationale: [
      "The supplied merchant dataset contains insufficient successful payment history.",
      "Waiting for more TEST MODE activity reduces the risk of making an unsupported recommendation.",
    ],
    expectedImpact: {
      revenueLiftPercent: 0,
      confidence: 80,
    },
    guardrails: [
      "Do not execute a real-money action.",
      "Collect more TEST MODE payment data before changing strategy.",
    ],
    testOfferAmount: 49900,
  };
}

export async function generateGrowthPlan(
  metrics: MerchantMetrics
) {
  const prompt = `You are a merchant-growth agent operating on Razorpay TEST MODE data.

Your job is to recommend exactly ONE bounded revenue-growth intervention.

Never claim that a forecast is guaranteed.

Merchant metrics:

${JSON.stringify(metrics, null, 2)}

Rules:

- Use ONLY the supplied metrics.
- Do NOT invent external facts.
- Choose exactly ONE action:
  RECOVER
  UPSELL
  OPTIMIZE_CHECKOUT
  DO_NOTHING
- Give a conservative estimated revenue lift percentage.
- Confidence must be between 0 and 100.
- testOfferAmount is an INR amount in paise.
- testOfferAmount must be between 100 and 1,000,000 paise.
- Include at least 2 rationale points.
- Include at least 2 safety guardrails.
- This is Razorpay TEST MODE only.
- Never guarantee revenue.
- Return ONLY valid JSON.
`;

  try {
    const text = await generateGeminiText({
      system:
        "You are a careful AI revenue-growth controller for a Razorpay merchant sandbox. Return only valid JSON.",

      prompt,

      maxTokens: 1200,

      temperature: 0.1,

      responseJsonSchema: {
        type: "object",

        properties: {
          recommendation: {
            type: "string",
          },

          action: {
            type: "string",
            enum: [
              "RECOVER",
              "UPSELL",
              "OPTIMIZE_CHECKOUT",
              "DO_NOTHING",
            ],
          },

          rationale: {
            type: "array",
            items: {
              type: "string",
            },
          },

          expectedImpact: {
            type: "object",
            properties: {
              revenueLiftPercent: {
                type: "number",
              },

              confidence: {
                type: "number",
              },
            },
            required: [
              "revenueLiftPercent",
              "confidence",
            ],
          },

          guardrails: {
            type: "array",
            items: {
              type: "string",
            },
          },

          testOfferAmount: {
            type: "integer",
          },
        },

        required: [
          "recommendation",
          "action",
          "rationale",
          "expectedImpact",
          "guardrails",
          "testOfferAmount",
        ],
      },
    });

    const parsed = planSchema.safeParse(parseJson(text));

    if (parsed.success) {
      return parsed.data;
    }

    console.error(
      "Gemini returned invalid growth plan:",
      parsed.error.message
    );
  } catch (error) {
    console.error("Gemini growth analysis failed:", error);
  }

  // Never let AI failure break the Growth Studio.
  return fallbackPlan(metrics);
}