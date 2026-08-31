import type { RazorpayOrder } from "@/lib/razorpay";

export interface MerchantMetrics {
  orderCount: number;
  paidOrderCount: number;
  failedPaymentCount: number;
  successfulPaymentCount: number;
  paymentAttempts: number;
  successRate: number;
  grossOrderValue: number;
  capturedRevenue: number;
  failedValue: number;
  averageOrderValue: number;
  refundedValue: number;
  paymentMethodMix: Record<string, number>;
  currency: string;
  periodLabel: string;
}

const money = (n: number) => Math.round(n / 100);
const pct = (n: number) => Math.round(n * 100) / 100;

export function calculateMerchantMetrics(orders: RazorpayOrder[]): MerchantMetrics {
  let paidOrderCount = 0;
  let failedPaymentCount = 0;
  let successfulPaymentCount = 0;
  let paymentAttempts = 0;
  let grossOrderValue = 0;
  let capturedRevenue = 0;
  let failedValue = 0;
  let refundedValue = 0;
  const paymentMethodCounts: Record<string, number> = {};

  for (const order of orders) {
    grossOrderValue += order.amount || 0;
    if (order.amount_paid > 0 || order.status === "paid") paidOrderCount += 1;
    const payments = order.payments?.items || [];
    paymentAttempts += payments.length || order.attempts || 0;
    for (const payment of payments) {
      const amount = payment.amount || 0;
      if (payment.status === "captured" || payment.status === "authorized") {
        successfulPaymentCount += 1;
        capturedRevenue += amount;
      }
      if (payment.status === "failed") {
        failedPaymentCount += 1;
        failedValue += amount;
      }
      refundedValue += payment.amount_refunded || 0;
      if (payment.method) {
        paymentMethodCounts[payment.method] = (paymentMethodCounts[payment.method] || 0) + 1;
      }
    }
  }

  const successRate = paymentAttempts > 0 ? (successfulPaymentCount / paymentAttempts) * 100 : 0;
  const paymentMethodTotal = Object.values(paymentMethodCounts).reduce((a, b) => a + b, 0);
  const paymentMethodMix = Object.fromEntries(
    Object.entries(paymentMethodCounts).map(([method, count]) => [method, pct((count / Math.max(paymentMethodTotal, 1)) * 100)])
  );

  return {
    orderCount: orders.length,
    paidOrderCount,
    failedPaymentCount,
    successfulPaymentCount,
    paymentAttempts,
    successRate: pct(successRate),
    grossOrderValue: money(grossOrderValue),
    capturedRevenue: money(capturedRevenue),
    failedValue: money(failedValue),
    averageOrderValue: money(grossOrderValue / Math.max(orders.length, 1)),
    refundedValue: money(refundedValue),
    paymentMethodMix,
    currency: orders[0]?.currency || "INR",
    periodLabel: "Latest Razorpay test-mode orders",
  };
}

export function demoMerchantMetrics(): MerchantMetrics {
  return {
    orderCount: 100,
    paidOrderCount: 82,
    failedPaymentCount: 18,
    successfulPaymentCount: 100,
    paymentAttempts: 118,
    successRate: 82,
    grossOrderValue: 1245000,
    capturedRevenue: 1012000,
    failedValue: 233000,
    averageOrderValue: 12450,
    refundedValue: 18500,
    paymentMethodMix: { upi: 58, card: 31, netbanking: 8, wallet: 3 },
    currency: "INR",
    periodLabel: "Demo merchant dataset (100 synthetic test orders)",
  };
}
