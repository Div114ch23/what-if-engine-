"use client";

import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "relative flex w-full max-w-sm items-start gap-4 rounded-lg border p-4 shadow-lg animate-in slide-in-from-bottom-5",
            toast.variant === "destructive" && "border-red-500 bg-red-50 text-red-900",
            toast.variant === "success" && "border-green-500 bg-green-50 text-green-900",
            toast.variant === "default" && "bg-background"
          )}
        >
          <div className="flex-1">
            <h4 className="font-semibold">{toast.title}</h4>
            {toast.description && (
              <p className="text-sm opacity-90 mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="rounded-full p-1 hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
