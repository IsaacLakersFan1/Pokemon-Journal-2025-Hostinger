export interface Game {
  id: number;
  name: string;
  pokemonGame?: string | null;
  notes?: string | null;
  playerCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  userId: number;
  playerGames?: Array<{
    id: number;
    playerId: number;
    gameId: number;
    player: { id: number; name: string };
  }>;
  _count?: {
    events: number;
    showdowns: number;
  };
}

export interface CreateGameRequest {
  name: string;
  playerCount?: number;
  pokemonGame?: string;
  notes?: string;
}

export interface GameResponse {
  games: Game[];
}
