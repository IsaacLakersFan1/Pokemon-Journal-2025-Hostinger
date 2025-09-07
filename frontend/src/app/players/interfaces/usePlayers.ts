import { Player } from "./Players";

export interface UsePlayersReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  fetchPlayers: () => Promise<void>;
}
