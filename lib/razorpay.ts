const RAZORPAY_BASE_URL = "https://api.razorpay.com/v1";

export interface RazorpayPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  order_id?: string;
  amount_refunded?: number;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  attempts: number;
  created_at: number;
  payments?: { items: RazorpayPayment[]; count: number };
}

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay test-mode credentials are not configured.");
  }
  if (!keyId.startsWith("rzp_test_")) {
    throw new Error("Razorpay integration must use a test-mode key (rzp_test_...).");
  }
  return { keyId, keySecret };
}

async function razorpayRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const { keyId, keySecret } = credentials();
  const token = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch(`${RAZORPAY_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error?.description || `Razorpay API error (${response.status})`);
  }
  return body as T;
}

export async function fetchRecentOrders(count = 100): Promise<RazorpayOrder[]> {
  const safeCount = Math.min(100, Math.max(1, count));
  const data = await razorpayRequest<{ items: RazorpayOrder[] }>(
    `/orders?count=${safeCount}&expand[]=payments`
  );
  return data.items || [];
}

export async function createTestOrder(input: {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  return razorpayRequest<RazorpayOrder>("/orders", {
    method: "POST",
    body: JSON.stringify({
      amount: Math.round(input.amount),
      currency: input.currency || "INR",
      receipt: input.receipt,
      notes: input.notes || {},
    }),
  });
}

export function isRazorpayConfigured() {
  return Boolean(
    process.env.RAZORPAY_KEY_ID?.startsWith("rzp_test_") &&
      process.env.RAZORPAY_KEY_SECRET
  );
}

export function getRazorpayPublicKey() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}
