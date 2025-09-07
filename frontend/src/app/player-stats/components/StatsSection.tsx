import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerStats } from "../interfaces/PlayerStats";

interface StatsSectionProps {
  stats: PlayerStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statsData = [
    { label: '🛒 Capturados', value: stats.caught, color: 'text-green-600' },
    { label: '❌ Huyeron', value: stats.runaway, color: 'text-red-600' },
    { label: '💔 Derrotados', value: stats.defeated, color: 'text-gray-600' },
    { label: '✨ Shiny', value: stats.shiny, color: 'text-yellow-600' }
  ];

  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">ESTADÍSTICAS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statsData.map((stat, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-lg">{stat.label}</span>
              <span className={`text-xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
