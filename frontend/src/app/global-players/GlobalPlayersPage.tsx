import { useGlobalPlayers } from "./hooks/useGlobalPlayers";
import { GlobalPlayersHeader } from "./components/GlobalPlayersHeader";
import { GlobalPlayersList } from "./components/GlobalPlayersList";
import { GlobalPlayersLoadingScreen } from "./components/GlobalPlayersLoadingScreen";
import { GlobalPlayersErrorScreen } from "./components/GlobalPlayersErrorScreen";

export function GlobalPlayersPage() {
  const { players, loading, error } = useGlobalPlayers();

  if (loading) {
    return <GlobalPlayersLoadingScreen />;
  }

  if (error) {
    return <GlobalPlayersErrorScreen error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GlobalPlayersHeader />
      <GlobalPlayersList players={players} />
    </div>
  );
}
