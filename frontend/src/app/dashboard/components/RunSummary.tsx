import { Event } from "../interfaces/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Skull, ArrowRight, Star, Crown, Swords } from "lucide-react";

interface RunSummaryProps {
  events: Event[];
  showdownCount: number;
}

export function RunSummary({ events, showdownCount }: RunSummaryProps) {
  const catched = events.filter((e) => e.status === "Catched").length;
  const defeated = events.filter((e) => e.status === "Defeated").length;
  const runAway = events.filter((e) => e.status === "Run Away").length;
  const shinies = events.filter((e) => e.isShiny).length;
  const champs = events.filter((e) => e.isChamp).length;

  const stats = [
    { label: "Vivos", value: catched, icon: Check, className: "text-green-600" },
    { label: "Caídos", value: defeated, icon: Skull, className: "text-red-600" },
    { label: "Huyeron", value: runAway, icon: ArrowRight, className: "text-muted-foreground" },
    { label: "Shinies", value: shinies, icon: Star, className: "text-amber-500" },
    { label: "Champs", value: champs, icon: Crown, className: "text-yellow-600" },
    { label: "Showdowns", value: showdownCount, icon: Swords, className: "text-indigo-600" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Resumen del run</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border bg-background px-3 py-3 text-center"
            >
              <stat.icon className={`mx-auto mb-1 h-5 w-5 ${stat.className}`} />
              <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
