import { PlayerCard } from "./PlayerCard";
import { Player } from "../interfaces/Players";

interface PlayersListProps {
  players: Player[];
  gameId: string;
}

export function PlayersList({ players, gameId }: PlayersListProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No hay entrenadores en este juego</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} gameId={gameId} />
      ))}
    </div>
  );
}
