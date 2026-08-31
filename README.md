# What If? Engine — Razorpay AI Growth & Agentic Commerce

A merchant-growth decision studio built for the Razorpay AI Buildathon. It combines a five-agent decision layer with a Razorpay **Test Mode** data/action loop:

1. Read recent Razorpay test-mode orders and payment outcomes.
2. Compute deterministic merchant signals such as payment success rate, captured revenue, failed value and payment-method mix.
3. Ask a specialized Growth Agent to diagnose the largest revenue opportunity.
4. Produce one bounded recommendation with an estimated lift, confidence and explicit guardrails.
5. Require an explicit user confirmation before creating a Razorpay **TEST MODE** order.
6. Open Razorpay Test Checkout so the full action can be demonstrated without moving real money.

The original What If? simulation studio remains intact: five independent AI agents (Revenue & Growth, Risk & Compliance, Customer & Retention, Cashflow & Finance, Market & Competitive) run in parallel and a Synthesis Agent resolves disagreement. Simulation responses now include a visible agent audit trail and structured-output validation.

## Razorpay AI Buildathon positioning

**Track:** AI Growth & Agentic Commerce.

The product is designed around the buildathon bar of a real working agent, bounded/explainable money actions, a visible audit trail, and graceful failure handling. The `/growth` page is the primary demo path.

### 90-second demo flow

1. Sign in.
2. Open **Merchant Growth**.
3. Show the merchant KPIs derived from Razorpay Test Mode orders (or the clearly-labelled demo dataset when keys are absent).
4. Run **Growth Agent**.
5. Explain the recommendation, expected lift, confidence and guardrails.
6. Click **Execute TEST action**. The server rejects unconfirmed or out-of-bounds actions and only accepts a `rzp_test_` key.
7. Complete or fail the Razorpay test payment. Both outcomes are handled in the UI; no real money is moved.
8. Open **Simulate** to show the five-agent audit trail and synthesis layer.

## Architecture

```text
                    Razorpay Test Mode
                           |
                    Orders + payments
                           |
                           v
                 Deterministic analytics
                           |
                           v
                    Growth Agent (AI)
                           |
        +------------------+------------------+
        |                  |                  |
   recommendation       guardrails      bounded amount
        |                  |                  |
        +------------------+------------------+
                           |
                   explicit user gate
                           |
                           v
                Create TEST Order (server)
                           |
                           v
                 Razorpay Test Checkout
                           |
                           v
                    audit trail / result

Existing simulation path:
Decision -> 5 parallel agents -> Synthesis Agent -> branches + agent signals + audit trail
```

## Razorpay integration

The app uses Razorpay's REST API with Basic Auth and **Test Mode** credentials. The merchant dashboard reads up to 100 recent orders with expanded payments. The bounded action creates a test order capped at ₹10,000 and adds audit notes identifying the action as `TEST_ONLY` and `user_confirmed`.

Never put a live Razorpay secret in the repository. The app rejects non-test `RAZORPAY_KEY_ID` values for the growth action.

## Setup

### 1. Install

```bash
npm install --legacy-peer-deps
```

### 2. Environment

Copy `.env.example` to `.env.local` and configure:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ANTHROPIC_API_KEY`
- `RAZORPAY_KEY_ID` — **Test Mode only** (`rzp_test_...`)
- `RAZORPAY_KEY_SECRET` — **Test Mode only**
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — same Test Mode key id
- Optional Stripe variables for the existing SaaS billing flow

Razorpay Test Mode has no real-money consequences, so it is appropriate for the demo.

### 3. Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

If you are upgrading an existing database, create/apply a migration for the new `Simulation.category` field rather than deleting existing data.

### 4. Run

```bash
npm run dev
```

Then visit:

- `/growth` — Razorpay AI Buildathon demo
- `/simulate` — original multi-agent What If engine
- `/scenarios` — scenario library
- `/pricing` — existing Stripe billing flow

## Reliability and safety improvements in this version

- Razorpay integration is explicitly restricted to Test Mode for the buildathon action.
- Test-order creation requires an explicit `confirmed: true` request and a bounded amount.
- All money actions are server-side; the browser cannot choose an arbitrary Razorpay endpoint.
- Razorpay API failures fall back to a clearly-labelled synthetic dataset for analysis, while execution remains disabled.
- Payment success/failure is handled in the test checkout demo.
- AI agent and synthesis outputs are validated with Zod instead of blindly trusting `JSON.parse` output.
- Simulation results expose the five independent agent outputs in an audit-trail tab.
- AI-derived signals are labelled as agent signals rather than pretending they are independently verified external evidence.
- Simulation free-tier counting now uses the calendar month, matching the UI wording.
- Stripe subscription webhook handling retrieves the Stripe subscription and uses Stripe's real billing period timestamps.
- The previously missing `/pricing` page is included and Stripe checkout price IDs are allow-listed.
- The previous Prisma/API mismatch is fixed by adding `Simulation.category` to the schema.

## Existing technology stack

- Next.js 14 / React / TypeScript
- PostgreSQL / Prisma
- NextAuth
- Anthropic Claude
- Razorpay Test Mode APIs + Checkout
- Stripe
- Tailwind CSS / Radix UI
- Recharts / Framer Motion
- Zod

## Important submission note

For the buildathon submission, publish the repository, deploy the app, record the requested pitch video, and include an architecture diagram. Do not commit `.env.local`, API secrets, Stripe secrets, or Razorpay secrets.
