import { PlayerStats, Pokemon } from "./PlayerStats";

export interface UsePlayerStatsReturn {
  stats: PlayerStats | null;
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchPokemons: () => Promise<void>;
}
