# Razorpay AI Buildathon — Submission Guide

## Recommended track

**AI Growth & Agentic Commerce**

## One-line pitch

> What If? Engine is an AI merchant-growth controller that reads Razorpay Test Mode payment signals, chooses one bounded revenue intervention, explains the decision, and executes only after explicit user approval.

## What to demo

### 1. Show the problem

Merchant revenue leakage is visible in payment outcomes, but deciding what to do next requires context across conversion, payment failures, order value and risk.

### 2. Show the data loop

Open `/growth` and point to:

- order count
- payment success rate
- captured revenue
- failed value
- average order value
- payment-method mix

When Razorpay test keys are configured, these are derived from the latest Test Mode orders. Without keys, the UI clearly labels the synthetic fallback.

### 3. Show the AI decision

Click **Run Growth Agent**.

Explain that the model does not receive an arbitrary business prompt alone. It receives deterministic merchant signals and must choose exactly one action:

- `RECOVER`
- `UPSELL`
- `OPTIMIZE_CHECKOUT`
- `DO_NOTHING`

It must also provide confidence, estimated lift and guardrails.

### 4. Show the safety gate

Click **Execute TEST action**.

The server enforces:

- authenticated user
- `confirmed: true`
- action allow-list
- amount between ₹1 and ₹10,000
- Razorpay `rzp_test_` key only
- server-side order creation
- audit log

### 5. Show the money-action loop

Razorpay Test Checkout opens. Use the test payment flow to demonstrate both success and failure. State clearly that Test Mode does not move real money.

### 6. Show the existing multi-agent engine

Open `/simulate` and run a scenario. Use the **Agent Audit** tab to show the five independent agent outputs before synthesis.

## Architecture to explain verbally

```text
Razorpay Test Mode
      |
      v
Orders + payments
      |
      v
Deterministic merchant metrics
      |
      v
Growth Agent
  |    |    |
  |    |    +--> guardrails
  |    +-------> confidence / lift
  +------------> one recommended action
      |
      v
Explicit user approval
      |
      v
Server-side bounded TEST Order
      |
      v
Razorpay Test Checkout
      |
      v
Audit log + success/failure handling
```

## What makes the AI meaningful

The AI is responsible for interpreting merchant signals and choosing the intervention. Deterministic code remains responsible for measurement, bounds and money-action controls. This separation is intentional: the model recommends; the server enforces.

## Failure case to show

Use a failed test payment and show the UI handling the failure without treating it as successful revenue. Also show that if Razorpay credentials are missing, analysis can use the clearly-labelled demo dataset but execution is disabled.

## Submission hygiene

Before publishing:

- Remove `.env.local` and all secrets.
- Use only Razorpay Test Mode credentials.
- Deploy the application.
- Verify `/growth` from a clean browser session.
- Verify test checkout success and failure.
- Verify the audit trail.
- Record the required pitch video.
- Publish the architecture diagram.
- Keep the README focused on the problem, AI loop, Razorpay integration, safety gates and evidence of working execution.
