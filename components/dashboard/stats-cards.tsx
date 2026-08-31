import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlaskConical, FileText, Globe, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalScenarios: number;
    totalSimulations: number;
    publicScenarios: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Your Scenarios",
      value: stats.totalScenarios,
      icon: FileText,
      description: "Total scenarios created",
    },
    {
      title: "Simulations Run",
      value: stats.totalSimulations,
      icon: FlaskConical,
      description: "AI simulations completed",
    },
    {
      title: "Public Scenarios",
      value: stats.publicScenarios,
      icon: Globe,
      description: "Shared with the community",
    },
    {
      title: "Engagement",
      value: stats.totalScenarios > 0
        ? Math.round((stats.publicScenarios / stats.totalScenarios) * 100)
        : 0,
      icon: TrendingUp,
      description: "Public ratio",
      suffix: "%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.value}
              {card.suffix || ""}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
