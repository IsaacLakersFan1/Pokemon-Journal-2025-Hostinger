import { GlobalPlayer } from "./GlobalPlayers";

export interface UseGlobalPlayersReturn {
  players: GlobalPlayer[];
  loading: boolean;
  error: string | null;
  fetchPlayers: () => Promise<void>;
}
