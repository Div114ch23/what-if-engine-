import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "What If? Engine — Agentic Decision Studio for Commerce",
  description:
    "Simulate pricing, cart-recovery, subscription-churn, dispute-risk, and cashflow decisions through five parallel AI agents and a synthesis layer, before you commit.",
  keywords: [
    "agentic commerce",
    "business simulation",
    "AI agents",
    "pricing decisions",
    "cashflow forecasting",
    "dispute risk",
    "what if",
  ],
  openGraph: {
    title: "What If? Engine — Agentic Decision Studio",
    description:
      "Five parallel AI agents simulate your next commerce decision before you make it",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <div className="min-h-screen bg-background">
                <Navbar />
                <main>{children}</main>
                <Toaster />
              </div>
              <Analytics />
            </QueryProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
