import { useGames } from "./hooks/useGames";
import { GamesHeader } from "./components/GamesHeader";
import { GamesList } from "./components/GamesList";

export function GamePage() {
  const { games, loading, error, deleteGame } = useGames();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <GamesHeader />
        <GamesList
          games={games}
          loading={loading}
          error={error}
          onDeleteGame={deleteGame}
        />
      </div>
    </div>
  );
}
