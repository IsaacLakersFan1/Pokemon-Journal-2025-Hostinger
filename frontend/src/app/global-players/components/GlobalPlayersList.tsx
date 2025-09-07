import { GlobalPlayerCard } from "./GlobalPlayerCard";
import { GlobalPlayer } from "../interfaces/GlobalPlayers";

interface GlobalPlayersListProps {
  players: GlobalPlayer[];
}

export function GlobalPlayersList({ players }: GlobalPlayersListProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay entrenadores registrados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {players.map((player) => (
        <GlobalPlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
}
