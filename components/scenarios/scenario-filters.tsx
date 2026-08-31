"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "ALL", label: "All Categories" },
  { value: "PRICING", label: "Pricing" },
  { value: "CART_RECOVERY", label: "Cart Recovery" },
  { value: "SUBSCRIPTION_CHURN", label: "Subscription Churn" },
  { value: "MARKET_ENTRY", label: "Market Entry" },
  { value: "DISPUTE_RISK", label: "Dispute Risk" },
  { value: "CASHFLOW", label: "Cashflow" },
  { value: "GROWTH", label: "Growth" },
  { value: "CUSTOMER_RETENTION", label: "Customer Retention" },
];

const sorts = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Viewed" },
  { value: "likes", label: "Most Liked" },
];

export function ScenarioFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "ALL" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/scenarios?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Select
        value={searchParams.get("category") || "ALL"}
        onValueChange={(value) => updateParam("category", value)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={searchParams.get("sort") || "recent"}
        onValueChange={(value) => updateParam("sort", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sorts.map((sort) => (
            <SelectItem key={sort.value} value={sort.value}>
              {sort.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
