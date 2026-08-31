import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, Bookmark, Settings, TrendingUp } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      icon: PlusCircle,
      label: "New Scenario",
      href: "/scenarios/new",
      variant: "default" as const,
    },
    {
      icon: Sparkles,
      label: "Run Simulation",
      href: "/simulate",
      variant: "secondary" as const,
    },
    {
      icon: TrendingUp,
      label: "Merchant Growth",
      href: "/growth",
      variant: "outline" as const,
    },
    {
      icon: Bookmark,
      label: "Bookmarks",
      href: "/profile",
      variant: "outline" as const,
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/profile",
      variant: "ghost" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant}
              size="sm"
              className="justify-start"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="mr-2 h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
