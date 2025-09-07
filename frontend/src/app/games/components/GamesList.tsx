import { Game } from "../interfaces/Game";
import { GameCard } from "./GameCard";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface GamesListProps {
  games: Game[];
  loading: boolean;
  error: string | null;
  onDeleteGame: (gameId: number) => void;
}

export function GamesList({ games, loading, error, onDeleteGame }: GamesListProps) {
  if (loading) {
    return <LoadingScreen message="Cargando juegos..." />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (games.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No tienes juegos disponibles. ¡Crea tu primer juego para empezar!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onDelete={onDeleteGame}
        />
      ))}
    </div>
  );
}
