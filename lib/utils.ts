import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-green-500";
  if (confidence >= 60) return "text-yellow-500";
  if (confidence >= 40) return "text-orange-500";
  return "text-red-500";
}

export function getProbabilityColor(probability: number): string {
  if (probability >= 70) return "bg-green-500";
  if (probability >= 50) return "bg-yellow-500";
  if (probability >= 30) return "bg-orange-500";
  return "bg-red-500";
}
