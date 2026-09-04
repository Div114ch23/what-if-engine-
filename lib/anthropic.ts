import { z } from "zod";
import { generateGeminiText } from "@/lib/gemini";

export interface SimulationInput {
  query: string;
  category: string;
  parameters?: Record<string, any>;
}

export interface SimulationResult {
  analysis: string;
  branches: Array<{
    title: string;
    description: string;
    probability: number;
    timeline: Array<{
      year: number;
      title: string;
      description: string;
      impact: string;
    }>;
  }>;
  evidence: Array<{
    title: string;
    source: string;
    summary: string;
    credibility: number;
  }>;
  confidence: number;
  keyInsights: string[];
  risks: string[];
  opportunities: string[];
  agentTrace: AgentOutput[];
}

/* ---------------------------------------------------------------------- *
 * AGENT LAYER
 *
 * Five specialized agents run independently in parallel using Gemini.
 * A sixth Synthesis Agent resolves disagreement between them.
 * ---------------------------------------------------------------------- */

interface AgentDefinition {
  id: string;
  name: string;
  systemPrompt: string;
}

interface AgentOutput {
  agentId: string;
  agentName: string;
  stance: "favorable" | "unfavorable" | "mixed";
  confidence: number;
  summary: string;
  supportingPoints: string[];
  flaggedRisks: string[];
  flaggedOpportunities: string[];
}

const AGENTS: AgentDefinition[] = [
  {
    id: "revenue_growth",
    name: "Revenue & Growth Agent",
    systemPrompt:
      "You are the Revenue & Growth Agent. You evaluate a business decision purely on its impact to top-line revenue, conversion, and growth trajectory. You are optimistic but numbers-driven. Always estimate concrete percentage or numeric impact where possible.",
  },
  {
    id: "risk_compliance",
    name: "Risk & Compliance Agent",
    systemPrompt:
      "You are the Risk & Compliance Agent. You evaluate a business decision purely for downside: fraud exposure, dispute/chargeback risk, regulatory exposure, and reputational risk. You are deliberately conservative and skeptical, and you actively look for reasons the decision could backfire.",
  },
  {
    id: "customer_retention",
    name: "Customer & Retention Agent",
    systemPrompt:
      "You are the Customer & Retention Agent. You evaluate a business decision purely on customer experience, churn risk, and retention/loyalty impact. You think in terms of subscriber behavior and lifetime value.",
  },
  {
    id: "cashflow_finance",
    name: "Cashflow & Finance Agent",
    systemPrompt:
      "You are the Cashflow & Finance Agent. You evaluate a business decision purely on near-term cash position, payout timing, margin impact, and financial runway. You think in 3-90 day horizons like a working-capital forecaster.",
  },
  {
    id: "market_competitive",
    name: "Market & Competitive Agent",
    systemPrompt:
      "You are the Market & Competitive Agent. You evaluate a business decision purely on competitive positioning, market timing, and how competitors or the broader market are likely to respond.",
  },
];

const agentOutputSchema = z.object({
  stance: z.enum(["favorable", "unfavorable", "mixed"]),
  confidence: z.number().min(0).max(100),
  summary: z.string().min(1),
  supportingPoints: z.array(z.string()).max(8),
  flaggedRisks: z.array(z.string()).max(8),
  flaggedOpportunities: z.array(z.string()).max(8),
});

const simulationSchema = z.object({
  analysis: z.string().min(1),
  branches: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string(),
        probability: z.number().min(0).max(100),
        timeline: z
          .array(
            z.object({
              year: z.number().int(),
              title: z.string(),
              description: z.string(),
              impact: z.string(),
            })
          )
          .max(6),
      })
    )
    .min(2)
    .max(3),
  evidence: z
    .array(
      z.object({
        title: z.string(),
        source: z.string(),
        summary: z.string(),
        credibility: z.number().min(1).max(10),
      })
    )
    .max(8),
  confidence: z.number().min(0).max(100),
  keyInsights: z.array(z.string()).max(8),
  risks: z.array(z.string()).max(8),
  opportunities: z.array(z.string()).max(8),
});

const AGENT_OUTPUT_INSTRUCTIONS = `Respond with ONLY valid JSON, no markdown code fences, no preamble, in this exact shape:
{
  "stance": "favorable" | "unfavorable" | "mixed",
  "confidence": <number 0-100>,
  "summary": "<2-3 sentence read from your lens only>",
  "supportingPoints": ["<point>", "..."],
  "flaggedRisks": ["<risk>", "..."],
  "flaggedOpportunities": ["<opportunity>", "..."]
}`;

/** Strips markdown code fences if the model wraps its JSON in them despite instructions. */
function extractJson(text: string): any {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonText = fenced ? fenced[1] : trimmed;
  return JSON.parse(jsonText);
}

async function runAgent(
  agent: AgentDefinition,
  input: SimulationInput
): Promise<AgentOutput> {
  const userPrompt = `Business decision to evaluate: "${input.query}"
Category: ${input.category}
${
  input.parameters
    ? `Additional context: ${JSON.stringify(input.parameters)}`
    : ""
}

Analyze this strictly from your lens as the ${agent.name}. Do not try to cover other perspectives.

${AGENT_OUTPUT_INSTRUCTIONS}`;

  const text = await generateGeminiText({
    system: agent.systemPrompt,
    prompt: userPrompt,
    maxTokens: 1024,
    temperature: 0.6,
  });

  const parsed = agentOutputSchema.safeParse(extractJson(text));

  if (!parsed.success) {
    throw new Error(
      `${agent.name} returned invalid structured output: ${parsed.error.message}`
    );
  }

  return {
    agentId: agent.id,
    agentName: agent.name,
    ...parsed.data,
  };
}

/**
 * Runs all five domain agents in TRUE PARALLEL (Promise.all),
 * then passes their structured outputs to a Synthesis Agent.
 */
export async function generateSimulation(
  input: SimulationInput
): Promise<SimulationResult> {
  const agentOutputs = await Promise.all(
    AGENTS.map((agent) => runAgent(agent, input))
  );

  const synthesisSystemPrompt = `You are the Synthesis Agent for an agentic business-decision studio. You have received independent, parallel assessments from five specialized agents (Revenue & Growth, Risk & Compliance, Customer & Retention, Cashflow & Finance, Market & Competitive). They may disagree.

Your job is to resolve conflicts by weighting each agent's stated confidence against how material its domain is to this specific decision category, and produce ONE coherent recommendation. Do not simply average the agents — reason about which concerns dominate.

Respond with ONLY valid JSON, no markdown code fences, no preamble, matching this shape:
{
  "analysis": "<3-5 sentence unified recommendation, referencing where agents agreed or conflicted>",
  "branches": [
    {
      "title": "<scenario name, e.g. 'If implemented as proposed'>",
      "description": "<what happens>",
      "probability": <0-100>,
      "timeline": [
        {
          "year": <int>,
          "title": "<milestone>",
          "description": "<detail>",
          "impact": "<effect>"
        }
      ]
    }
  ],
  "evidence": [
    {
      "title": "<agent-derived data point>",
      "source": "<which agent>",
      "summary": "<detail>",
      "credibility": <1-10>
    }
  ],
  "confidence": <0-100, overall synthesized confidence>,
  "keyInsights": ["<insight>", "..."],
  "risks": ["<risk>", "..."],
  "opportunities": ["<opportunity>", "..."]
}

Generate 2-3 branches (e.g. best case, base case, worst case) and 2-4 timeline events per branch. Treat the evidence array as "agent signals", not independently verified external evidence. Attribute each signal to its source agent by name and do not imply external sourcing.`;

  const synthesisUserPrompt = `Decision: "${input.query}"
Category: ${input.category}

Independent agent assessments (JSON):
${JSON.stringify(agentOutputs, null, 2)}

Synthesize these into one unified recommendation per the required JSON shape.`;

  const synthesisText = await generateGeminiText({
    system: synthesisSystemPrompt,
    prompt: synthesisUserPrompt,
    maxTokens: 4096,
    temperature: 0.5,
  });

  const parsedResult = simulationSchema.safeParse(
    extractJson(synthesisText)
  );

  if (!parsedResult.success) {
    throw new Error(
      `Synthesis Agent returned invalid structured output: ${parsedResult.error.message}`
    );
  }

  const parsed = parsedResult.data;

  return {
    analysis: parsed.analysis || "No analysis generated",

    branches: (parsed.branches || []).map((b: any) => ({
      title: b.title || "Untitled Branch",
      description: b.description || "",
      probability: Math.min(
        100,
        Math.max(0, b.probability || 50)
      ),
      timeline: (b.timeline || []).map((t: any) => ({
        year: t.year || new Date().getFullYear(),
        title: t.title || "",
        description: t.description || "",
        impact: t.impact || "",
      })),
    })),

    evidence: (parsed.evidence || []).map((e: any) => ({
      title: e.title || "",
      source: e.source || "",
      summary: e.summary || "",
      credibility: Math.min(
        10,
        Math.max(1, e.credibility || 5)
      ),
    })),

    confidence: Math.min(
      100,
      Math.max(0, parsed.confidence || 50)
    ),

    keyInsights: parsed.keyInsights || [],
    risks: parsed.risks || [],
    opportunities: parsed.opportunities || [],
    agentTrace: agentOutputs,
  };
}

export async function generateScenarioFromQuery(
  query: string
): Promise<{
  title: string;
  description: string;
  category: string;
  tags: string[];
}> {
  const text = await generateGeminiText({
    system:
      "You are a business-decision scenario generator for an agentic commerce decision studio. Given a user query about a business decision, generate a structured scenario. Respond with ONLY valid JSON, no markdown code fences, no preamble, with: title, description, category (one of: PRICING, CART_RECOVERY, SUBSCRIPTION_CHURN, MARKET_ENTRY, DISPUTE_RISK, CASHFLOW, GROWTH, CUSTOMER_RETENTION), tags (array of strings).",
    prompt: query,
    maxTokens: 1024,
    temperature: 0.7,
  });

  return extractJson(text);
}