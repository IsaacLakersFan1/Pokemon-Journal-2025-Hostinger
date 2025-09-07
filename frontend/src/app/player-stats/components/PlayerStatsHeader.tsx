import { PlayerStats } from "../interfaces/PlayerStats";

interface PlayerStatsHeaderProps {
  stats: PlayerStats;
}

export function PlayerStatsHeader({ stats }: PlayerStatsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-extrabold text-gray-800">
        Estadísticas de {stats.playerName}
      </h1>
      <p className="text-gray-600 mt-2">
        Resumen de capturas y encuentros
      </p>
    </div>
  );
}
