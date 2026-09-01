import { PrismaClient, ScenarioCategory, ScenarioStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const seedUser = await prisma.user.upsert({
    where: { email: "demo@whatifengine.app" },
    update: {},
    create: {
      email: "demo@whatifengine.app",
      name: "Demo Analyst",
      role: "PREMIUM",
    },
  });

  const sampleScenarios = [
    {
      userId: seedUser.id,
      title: "What if we auto-nudged abandoned carts via WhatsApp within 15 minutes?",
      slug: "cart-recovery-whatsapp-15min",
      description:
        "Simulate the revenue, cost, and customer-experience impact of deploying an automated cart-recovery agent that reaches out over WhatsApp within 15 minutes of checkout abandonment, versus the current 24-hour email-only flow.",
      category: ScenarioCategory.CART_RECOVERY,
      tags: ["cart-recovery", "whatsapp", "conversion", "automation"],
      status: ScenarioStatus.PUBLISHED,
      isPublic: true,
      viewCount: 1240,
      likeCount: 89,
      branches: {
        create: [
          {
            title: "High Recovery, Manageable Cost",
            description:
              "Fast, personalized nudges recover a meaningful share of abandoned carts without triggering opt-outs.",
            probability: 45,
            orderIndex: 0,
            timeline: {
              create: [
                { year: 2026, title: "Agent goes live on 15-min trigger", description: "Automated WhatsApp nudge fires for all abandoned carts above ₹500", impact: "Recovery rate lifts from 8% to 18-22% in first month", probability: 75, orderIndex: 0 },
                { year: 2026, title: "Discount-tiering added", description: "Agent learns to offer smaller discounts for higher-intent carts", impact: "Margin erosion contained to under 3%", probability: 60, orderIndex: 1 },
                { year: 2027, title: "Recovery flow extended to SMS fallback", description: "Non-WhatsApp users get equivalent SMS nudge", impact: "Incremental 4-6% additional recovery", probability: 55, orderIndex: 2 },
              ],
            },
          },
          {
            title: "Opt-Out Fatigue",
            description:
              "Message frequency and timing feel intrusive; customers unsubscribe faster than expected.",
            probability: 30,
            orderIndex: 1,
            timeline: {
              create: [
                { year: 2026, title: "Initial spike in opt-outs", description: "WhatsApp opt-out rate exceeds 12% in week one", impact: "Channel reach shrinks for future campaigns", probability: 50, orderIndex: 0 },
                { year: 2026, title: "Frequency capping introduced", description: "Agent limits nudges to one per cart, cools down after no response", impact: "Opt-outs stabilize but recovery lift is smaller than projected", probability: 55, orderIndex: 1 },
              ],
            },
          },
          {
            title: "Compliance Friction",
            description:
              "Messaging-consent and data-use requirements slow rollout and limit targeting precision.",
            probability: 25,
            orderIndex: 2,
            timeline: {
              create: [
                { year: 2026, title: "Consent audit flags gaps", description: "Not all checkout flows captured explicit WhatsApp opt-in", impact: "Launch delayed 3-4 weeks for consent remediation", probability: 45, orderIndex: 0 },
                { year: 2026, title: "Scoped relaunch", description: "Agent restricted to customers with clear opt-in", impact: "Addressable cart pool shrinks by ~35%", probability: 50, orderIndex: 1 },
              ],
            },
          },
        ],
      },
      evidence: {
        create: [
          { title: "Baymard Institute cart abandonment benchmarks", source: "Baymard Institute", url: "https://baymard.com", summary: "Industry baseline abandonment and recovery-channel effectiveness data", credibility: 9, relevance: 10 },
          { title: "Razorpay State of Commerce Report", source: "Razorpay", url: "https://razorpay.com", summary: "India-specific checkout and payment-failure behavior patterns", credibility: 9, relevance: 10 },
          { title: "WhatsApp Business Platform policy guidelines", source: "Meta", url: "https://business.whatsapp.com", summary: "Messaging frequency, consent, and opt-out requirements for commercial use", credibility: 8, relevance: 9 },
        ],
      },
    },
    {
      userId: seedUser.id,
      title: "What if we raised premium subscription price by 12%?",
      slug: "pricing-premium-tier-12-percent",
      description:
        "Model the churn, revenue, and competitive-response impact of a 12% price increase on the premium subscription tier, rolled out with 30 days' notice.",
      category: ScenarioCategory.PRICING,
      tags: ["pricing", "subscription", "churn", "revenue"],
      status: ScenarioStatus.PUBLISHED,
      isPublic: true,
      viewCount: 3560,
      likeCount: 245,
      branches: {
        create: [
          {
            title: "Net Revenue Gain",
            description: "Churn stays below the break-even threshold; net revenue rises despite some cancellations.",
            probability: 40,
            orderIndex: 0,
            timeline: {
              create: [
                { year: 2026, title: "Price change announced", description: "30-day advance notice sent to all premium subscribers", impact: "Initial support-ticket spike, manageable volume", probability: 80, orderIndex: 0 },
                { year: 2026, title: "Churn within modeled range", description: "Cancellations land at 5-7%, below the 9% break-even line", impact: "Net MRR increases by ~6% post-rollout", probability: 55, orderIndex: 1 },
                { year: 2027, title: "Grandfathering pressure emerges", description: "Long-tenure users request legacy pricing", impact: "Small cohort exception, contained cost", probability: 45, orderIndex: 2 },
              ],
            },
          },
          {
            title: "Churn Exceeds Break-Even",
            description: "Price sensitivity is higher than modeled, especially among price-anchored long-tenure users.",
            probability: 30,
            orderIndex: 1,
            timeline: {
              create: [
                { year: 2026, title: "Cancellation wave", description: "Churn reaches 11-13% in the 30 days after the increase takes effect", impact: "Net revenue dips below pre-increase baseline", probability: 55, orderIndex: 0 },
                { year: 2026, title: "Win-back campaign launched", description: "Discounted re-subscription offers sent to churned users", impact: "Recovers roughly a third of lost subscribers", probability: 40, orderIndex: 1 },
              ],
            },
          },
          {
            title: "Competitive Undercut",
            description: "A close competitor holds pricing steady and captures price-sensitive switchers.",
            probability: 30,
            orderIndex: 2,
            timeline: {
              create: [
                { year: 2026, title: "Competitor pricing campaign", description: "Rival markets itself as the 'no price hike' alternative", impact: "Elevated churn specifically to that competitor", probability: 50, orderIndex: 0 },
                { year: 2027, title: "Feature differentiation response", description: "Premium tier adds exclusive features to justify the gap", impact: "Churn to competitor slows over two quarters", probability: 45, orderIndex: 1 },
              ],
            },
          },
        ],
      },
      evidence: {
        create: [
          { title: "ProfitWell SaaS pricing elasticity study", source: "ProfitWell", url: "https://profitwell.com", summary: "Churn sensitivity benchmarks for subscription price increases by tier", credibility: 8, relevance: 10 },
          { title: "Razorpay Subscription Recovery Agent documentation", source: "Razorpay", url: "https://razorpay.com", summary: "Patterns in failed and cancelled subscription payments across Indian SaaS/D2C", credibility: 8, relevance: 9 },
        ],
      },
    },
    {
      userId: seedUser.id,
      title: "What if we auto-contested chargebacks with AI-compiled evidence?",
      slug: "dispute-risk-ai-evidence-agent",
      description:
        "Evaluate deploying an agent that automatically assembles and submits chargeback-dispute evidence (delivery proof, communication logs, IP/device match) within the card network's response window, instead of manual ops review.",
      category: ScenarioCategory.DISPUTE_RISK,
      tags: ["disputes", "chargebacks", "fraud", "automation"],
      status: ScenarioStatus.PUBLISHED,
      isPublic: true,
      viewCount: 1890,
      likeCount: 156,
      branches: {
        create: [
          {
            title: "Higher Win Rate, Faster Turnaround",
            description: "Automated evidence compilation beats manual response-time and consistency.",
            probability: 45,
            orderIndex: 0,
            timeline: {
              create: [
                { year: 2026, title: "Agent handles first response wave", description: "Evidence bundled and submitted within 6 hours vs. previous 3-day manual average", impact: "Dispute win rate rises from ~35% to 52%", probability: 65, orderIndex: 0 },
                { year: 2026, title: "Ops team shifts to exceptions only", description: "Manual review reserved for high-value or ambiguous cases", impact: "Ops workload for disputes drops ~60%", probability: 60, orderIndex: 1 },
              ],
            },
          },
          {
            title: "False-Positive Evidence Risk",
            description: "Automated evidence assembly occasionally submits weak or mismatched evidence, hurting credibility with the network.",
            probability: 25,
            orderIndex: 1,
            timeline: {
              create: [
                { year: 2026, title: "Evidence quality flagged by acquirer", description: "A batch of auto-submitted disputes gets rejected for incomplete documentation", impact: "Win rate dips temporarily below manual baseline", probability: 40, orderIndex: 0 },
                { year: 2026, title: "Human-in-the-loop checkpoint added", description: "Agent drafts evidence, ops approves before submission for the first 90 days", impact: "Quality stabilizes; turnaround still 5x faster than fully manual", probability: 55, orderIndex: 1 },
              ],
            },
          },
          {
            title: "Fraud Ring Adaptation",
            description: "Sophisticated fraud actors adjust behavior once they detect automated, pattern-based responses.",
            probability: 30,
            orderIndex: 2,
            timeline: {
              create: [
                { year: 2026, title: "Adaptive fraud patterns observed", description: "Repeat disputers vary claim reasons to evade the agent's evidence templates", impact: "Win rate on this sub-segment plateaus", probability: 40, orderIndex: 0 },
                { year: 2027, title: "Agent retrained on new patterns", description: "Evidence-matching logic updated with adversarial examples", impact: "Win rate recovers within one quarter", probability: 50, orderIndex: 1 },
              ],
            },
          },
        ],
      },
      evidence: {
        create: [
          { title: "Visa/Mastercard chargeback response-time requirements", source: "Card network documentation", url: "https://razorpay.com", summary: "Standard response windows and evidence requirements for dispute resolution", credibility: 9, relevance: 10 },
          { title: "Razorpay Dispute Responder Agent overview", source: "Razorpay", url: "https://razorpay.com", summary: "Automated evidence review and submission for chargeback cases", credibility: 8, relevance: 10 },
        ],
      },
    },
    {
      userId: seedUser.id,
      title: "What if we forecasted cashflow 7 days ahead and pre-emptively delayed vendor payouts?",
      slug: "cashflow-7day-forecast-payout-delay",
      description:
        "Simulate the effect of a cashflow-forecasting agent that predicts payout shortfalls 7 days in advance and automatically stages/delays non-critical vendor payouts to prevent a negative cash position.",
      category: ScenarioCategory.CASHFLOW,
      tags: ["cashflow", "forecasting", "vendor-payouts", "working-capital"],
      status: ScenarioStatus.PUBLISHED,
      isPublic: true,
      viewCount: 980,
      likeCount: 61,
      branches: {
        create: [
          {
            title: "Shortfall Avoided",
            description: "Early forecasting gives enough lead time to stage payouts without disrupting vendor relationships.",
            probability: 50,
            orderIndex: 0,
            timeline: {
              create: [
                { year: 2026, title: "First predicted shortfall caught", description: "Agent flags a projected negative balance 6 days out", impact: "Two non-critical payouts staged by 48 hours, shortfall avoided", probability: 70, orderIndex: 0 },
                { year: 2026, title: "Vendor communication automated", description: "Affected vendors get automatic advance notice of payout timing shifts", impact: "No vendor escalations in first quarter of use", probability: 60, orderIndex: 1 },
              ],
            },
          },
          {
            title: "Vendor Trust Erosion",
            description: "Even brief payout delays damage relationships with vendors who expect fixed-date payments.",
            probability: 25,
            orderIndex: 1,
            timeline: {
              create: [
                { year: 2026, title: "Key vendor renegotiates terms", description: "A high-volume vendor demands stricter SLAs after a delayed payout", impact: "Contractual penalty clause added for future delays", probability: 40, orderIndex: 0 },
              ],
            },
          },
          {
            title: "Forecast Miss",
            description: "An unmodeled spike in refunds or disputes causes the forecast to miss, and the shortfall happens anyway.",
            probability: 25,
            orderIndex: 2,
            timeline: {
              create: [
                { year: 2026, title: "Refund spike outside model", description: "A product-quality issue drives refund volume 3x above forecast inputs", impact: "Shortfall occurs despite payout staging", probability: 35, orderIndex: 0 },
                { year: 2026, title: "Model retrained with refund signal", description: "Refund-rate volatility added as a forecast input", impact: "Forecast accuracy improves for future cycles", probability: 55, orderIndex: 1 },
              ],
            },
          },
        ],
      },
      evidence: {
        create: [
          { title: "Razorpay Cashflow Forecast Agent overview", source: "Razorpay", url: "https://razorpay.com", summary: "3-7 day forward cash position prediction for payout planning", credibility: 8, relevance: 10 },
          { title: "Working capital management benchmarks", source: "McKinsey", url: "https://mckinsey.com", summary: "Impact of short-term cash forecasting on SME working capital efficiency", credibility: 8, relevance: 8 },
        ],
      },
    },
  ];

  for (const scenario of sampleScenarios) {
    await prisma.scenario.create({
      data: scenario,
    });
  }

  console.log("✅ Seeded 4 sample commerce-decision scenarios with branches, timelines, and evidence");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });