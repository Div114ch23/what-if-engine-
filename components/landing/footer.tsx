import Link from "next/link";
import { FlaskConical } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <FlaskConical className="h-6 w-6 text-blue-600" />
              What If? Engine
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              An agentic decision studio that runs pricing, cart-recovery,
              subscription-churn, dispute-risk, and cashflow decisions through
              five parallel AI agents before you commit.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/scenarios" className="hover:text-foreground">
                  Explore Scenarios
                </Link>
              </li>
              <li>
                <Link href="/simulate" className="hover:text-foreground">
                  Run Simulation
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} What If? Engine. All rights reserved.
        </div>
      </div>
    </footer>
  );
}