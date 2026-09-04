import { generateGeminiText } from "@/lib/gemini";
import { z } from "zod";
import type { MerchantMetrics } from "@/lib/merchant-analytics";

const planSchema = z.object({
  recommendation: z.string().min(1).max(1200),
  action: z.enum(["RECOVER", "UPSELL", "OPTIMIZE_CHECKOUT", "DO_NOTHING"]),
  rationale: z.array(z.string()).min(2).max(5),
  expectedImpact: z.object({
    revenueLiftPercent: z.number().min(-100).max(100),
    confidence: z.number().min(0).max(100),
  }),
  guardrails: z.array(z.string()).min(2).max(6),
  testOfferAmount: z.number().int().min(100).max(1000000),
});

function parseJson(text: string) {
  const fenced = text.trim().match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  return JSON.parse(fenced ? fenced[1] : text.trim());
}

export async function generateGrowthPlan(metrics: MerchantMetrics) {
  const prompt = `You are a merchant-growth agent operating on Razorpay TEST MODE data. Your job is to recommend one bounded revenue-growth intervention. Never claim a forecast is guaranteed. Prefer recovery of failed payments or a small upsell when supported by the data.

Merchant metrics:
${JSON.stringify(metrics, null, 2)}

Rules:
- Use only the supplied metrics; do not invent external facts.
- Choose exactly one action: RECOVER, UPSELL, OPTIMIZE_CHECKOUT, or DO_NOTHING.
- Give a conservative estimated revenue lift percentage.
- The testOfferAmount is an INR amount in paise, capped at ₹10,000, that can be used for a TEST MODE order only.
- Include explicit safety guardrails and explain why the action is bounded.
- Respond ONLY as JSON matching this shape:
{
  "recommendation": "...",
  "action": "RECOVER|UPSELL|OPTIMIZE_CHECKOUT|DO_NOTHING",
  "rationale": ["..."],
  "expectedImpact": {"revenueLiftPercent": 0, "confidence": 0},
  "guardrails": ["..."],
  "testOfferAmount": 49900
}`;

  const text = await generateGeminiText({
  system:
    "You are a careful AI revenue-growth controller for a Razorpay merchant sandbox.",
  prompt,
  maxTokens: 1800,
  temperature: 0.2,
});

const parsed = planSchema.safeParse(parseJson(text));
  if (!parsed.success) throw new Error(`Growth agent returned invalid structured output: ${parsed.error.message}`);
  return parsed.data;
}
