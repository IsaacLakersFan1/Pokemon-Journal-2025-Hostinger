import { useParams } from "react-router-dom";
import { usePlayers } from "./hooks/usePlayers";
import { PlayersHeader } from "./components/PlayersHeader";
import { PlayersList } from "./components/PlayersList";
import { PlayersLoadingScreen } from "./components/LoadingScreen";
import { ErrorScreen } from "./components/ErrorScreen";

export function PlayersPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { players, loading, error } = usePlayers();

  if (!gameId) {
    return <ErrorScreen error="ID del juego no encontrado" />;
  }

  if (loading) {
    return <PlayersLoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PlayersHeader />
      <PlayersList players={players} gameId={gameId} />
    </div>
  );
}