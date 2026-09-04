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
      "You are the Revenue & Growth Agent. Evaluate the decision only from revenue, conversion, and growth. Be numbers-driven and conservative.",
  },
  {
    id: "risk_compliance",
    name: "Risk & Compliance Agent",
    systemPrompt:
      "You are the Risk & Compliance Agent. Evaluate only downside risks including fraud, disputes, regulatory exposure, and reputation. Be conservative.",
  },
  {
    id: "customer_retention",
    name: "Customer & Retention Agent",
    systemPrompt:
      "You are the Customer & Retention Agent. Evaluate only customer experience, churn, retention, loyalty, and lifetime value.",
  },
  {
    id: "cashflow_finance",
    name: "Cashflow & Finance Agent",
    systemPrompt:
      "You are the Cashflow & Finance Agent. Evaluate only near-term cash position, margin, payout timing, and financial runway.",
  },
  {
    id: "market_competitive",
    name: "Market & Competitive Agent",
    systemPrompt:
      "You are the Market & Competitive Agent. Evaluate only competitive positioning, market timing, and likely competitor response.",
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

const AGENT_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    stance: {
      type: "string",
      enum: ["favorable", "unfavorable", "mixed"],
    },
    confidence: {
      type: "number",
    },
    summary: {
      type: "string",
    },
    supportingPoints: {
      type: "array",
      items: {
        type: "string",
      },
    },
    flaggedRisks: {
      type: "array",
      items: {
        type: "string",
      },
    },
    flaggedOpportunities: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "stance",
    "confidence",
    "summary",
    "supportingPoints",
    "flaggedRisks",
    "flaggedOpportunities",
  ],
};

const SIMULATION_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    analysis: {
      type: "string",
    },

    branches: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          description: {
            type: "string",
          },
          probability: {
            type: "number",
          },
          timeline: {
            type: "array",
            items: {
              type: "object",
              properties: {
                year: {
                  type: "integer",
                },
                title: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                impact: {
                  type: "string",
                },
              },
              required: [
                "year",
                "title",
                "description",
                "impact",
              ],
            },
          },
        },
        required: [
          "title",
          "description",
          "probability",
          "timeline",
        ],
      },
    },

    evidence: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
          },
          source: {
            type: "string",
          },
          summary: {
            type: "string",
          },
          credibility: {
            type: "number",
          },
        },
        required: [
          "title",
          "source",
          "summary",
          "credibility",
        ],
      },
    },

    confidence: {
      type: "number",
    },

    keyInsights: {
      type: "array",
      items: {
        type: "string",
      },
    },

    risks: {
      type: "array",
      items: {
        type: "string",
      },
    },

    opportunities: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },

  required: [
    "analysis",
    "branches",
    "evidence",
    "confidence",
    "keyInsights",
    "risks",
    "opportunities",
  ],
};

function extractJson(text: string): any {
  const trimmed = text.trim();

  const fenced = trimmed.match(
    /```(?:json)?\s*([\s\S]*?)\s*```/i
  );

  const jsonText = fenced ? fenced[1].trim() : trimmed;

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

Analyze this strictly from your lens as the ${agent.name}.

Return a concise structured assessment.
Do not discuss other agent perspectives.`;

  const text = await generateGeminiText({
    system: agent.systemPrompt,
    prompt: userPrompt,
    maxTokens: 1200,
    temperature: 0.3,
    responseJsonSchema: AGENT_OUTPUT_SCHEMA,
  });

  const parsed = agentOutputSchema.safeParse(
    extractJson(text)
  );

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

  const synthesisSystemPrompt = `You are the Synthesis Agent for an agentic business-decision studio.

You have received independent assessments from five specialized agents:
- Revenue & Growth
- Risk & Compliance
- Customer & Retention
- Cashflow & Finance
- Market & Competitive

Resolve disagreements intelligently. Do not simply average them.

Create one coherent recommendation.

Generate:
- 2 or 3 scenario branches
- 2 to 4 timeline events per branch
- agent-derived signals as evidence
- overall confidence
- key insights
- risks
- opportunities

Important:
The evidence array contains AI-generated agent signals, NOT independently verified external evidence.
Never imply that these are external sources.

Keep every field concise so the final JSON remains compact.`;

  const synthesisUserPrompt = `Decision: "${input.query}"

Category: ${input.category}

Independent agent assessments:

${JSON.stringify(agentOutputs)}

Synthesize these assessments into the required structured output.`;

  const synthesisText = await generateGeminiText({
    system: synthesisSystemPrompt,
    prompt: synthesisUserPrompt,
    maxTokens: 5000,
    temperature: 0.3,
    responseJsonSchema: SIMULATION_OUTPUT_SCHEMA,
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

    branches: parsed.branches.map((b) => ({
      title: b.title || "Untitled Branch",
      description: b.description || "",
      probability: Math.min(
        100,
        Math.max(0, b.probability || 50)
      ),
      timeline: b.timeline.map((t) => ({
        year: t.year || new Date().getFullYear(),
        title: t.title || "",
        description: t.description || "",
        impact: t.impact || "",
      })),
    })),

    evidence: parsed.evidence.map((e) => ({
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
      "You are a business-decision scenario generator. Return concise valid JSON containing title, description, category, and tags.",

    prompt: query,

    maxTokens: 1024,

    temperature: 0.5,

    responseJsonSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        category: {
          type: "string",
          enum: [
            "PRICING",
            "CART_RECOVERY",
            "SUBSCRIPTION_CHURN",
            "MARKET_ENTRY",
            "DISPUTE_RISK",
            "CASHFLOW",
            "GROWTH",
            "CUSTOMER_RETENTION",
          ],
        },
        tags: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "title",
        "description",
        "category",
        "tags",
      ],
    },
  });

  return extractJson(text);
}