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

export async function generateGrowthPlan(
  metrics: MerchantMetrics
) {
  const prompt = `You are a merchant-growth agent operating on Razorpay TEST MODE data.

Your job is to recommend exactly ONE bounded revenue-growth intervention.

Never claim that a forecast is guaranteed.

Prefer recovery of failed payments or a small upsell when supported by the supplied data.

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
- Include at least 2 clear rationale points.
- Include at least 2 explicit safety guardrails.
- Keep the recommendation practical and bounded.
- This is Razorpay TEST MODE only.
- Never imply that real customer money will be charged.
- Never guarantee revenue.

Return only the requested structured JSON.`;

  const text = await generateGeminiText({
    system:
      "You are a careful AI revenue-growth controller for a Razorpay merchant sandbox. Always follow the requested JSON structure exactly.",

    prompt,

    maxTokens: 1200,

    temperature: 0.2,

    responseJsonSchema: {
      type: "OBJECT",

      properties: {
        recommendation: {
          type: "STRING",
        },

        action: {
          type: "STRING",
          enum: [
            "RECOVER",
            "UPSELL",
            "OPTIMIZE_CHECKOUT",
            "DO_NOTHING",
          ],
        },

        rationale: {
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },

        expectedImpact: {
          type: "OBJECT",

          properties: {
            revenueLiftPercent: {
              type: "NUMBER",
            },

            confidence: {
              type: "NUMBER",
            },
          },

          required: [
            "revenueLiftPercent",
            "confidence",
          ],
        },

        guardrails: {
          type: "ARRAY",

          items: {
            type: "STRING",
          },
        },

        testOfferAmount: {
          type: "INTEGER",
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

  if (!parsed.success) {
    throw new Error(
      `Growth agent returned invalid structured output: ${parsed.error.message}`
    );
  }

  return parsed.data;
}