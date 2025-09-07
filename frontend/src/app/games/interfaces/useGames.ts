import { Game } from "./Game";

export interface UseGamesReturn {
  games: Game[];
  loading: boolean;
  error: string | null;
  fetchGames: () => Promise<void>;
  deleteGame: (gameId: number) => Promise<void>;
}
