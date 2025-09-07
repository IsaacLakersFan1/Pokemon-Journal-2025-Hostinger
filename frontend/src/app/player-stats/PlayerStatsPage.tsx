import { usePlayerStats } from "./hooks/usePlayerStats";
import { PlayerStatsHeader } from "./components/PlayerStatsHeader";
import { TypeEncounterSection } from "./components/TypeEncounterSection";
import { StatsSection } from "./components/StatsSection";
import { PokemonGrid } from "./components/PokemonGrid";
import { PlayerStatsLoadingScreen } from "./components/PlayerStatsLoadingScreen";
import { PlayerStatsErrorScreen } from "./components/PlayerStatsErrorScreen";

export function PlayerStatsPage() {
  const { stats, pokemons, loading, error } = usePlayerStats();

  if (loading) {
    return <PlayerStatsLoadingScreen />;
  }

  if (error) {
    return <PlayerStatsErrorScreen error={error} />;
  }

  if (!stats) {
    return <PlayerStatsErrorScreen error="No se pudieron cargar las estadísticas" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PlayerStatsHeader stats={stats} />
      
      <div className="space-y-8">
        {/* Type Encounter Section */}
        <TypeEncounterSection typeCounts={stats.typeCounts} />

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Pokémon Grid Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Pokemon Capturados</h2>
          <PokemonGrid pokemons={pokemons} />
        </div>
      </div>
    </div>
  );
}
