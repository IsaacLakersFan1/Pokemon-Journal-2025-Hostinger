import { useState } from "react";
import { useParams } from "react-router-dom";
import { usePlayerStats } from "./hooks/usePlayerStats";
import { PlayerStatsHeader } from "./components/PlayerStatsHeader";
import { TypeEncounterSection } from "./components/TypeEncounterSection";
import { StatsSection } from "./components/StatsSection";
import { PokemonGrid } from "./components/PokemonGrid";
import { PokemonDetailModal } from "./components/PokemonDetailModal";
import { PlayerStatsLoadingScreen } from "./components/PlayerStatsLoadingScreen";
import { PlayerStatsErrorScreen } from "./components/PlayerStatsErrorScreen";

export function PlayerStatsPage() {
  const { playerId } = useParams<{ playerId: string }>();
  const { stats, pokemons, loading, error } = usePlayerStats();
  const [detailPokemonId, setDetailPokemonId] = useState<number | null>(null);

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
        <TypeEncounterSection typeCounts={stats.typeCounts} />
        <StatsSection stats={stats} />
        <div>
          <h2 className="text-2xl font-bold mb-6">Pokemon Capturados</h2>
          <PokemonGrid
            pokemons={pokemons}
            onPokemonClick={(pokemonId) => setDetailPokemonId(pokemonId)}
          />
        </div>
      </div>
      {playerId && detailPokemonId !== null && (
        <PokemonDetailModal
          open={detailPokemonId !== null}
          onOpenChange={(open) => !open && setDetailPokemonId(null)}
          playerId={Number(playerId)}
          pokemonId={detailPokemonId}
        />
      )}
    </div>
  );
}
