export interface Player {
  id: number;
  name: string;
  pokemonId?: number;
  pokemon?: {
    id: number;
    name: string;
    form?: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  userId: number;
}

export interface Pokemon {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface CreateGameRequest {
  name: string;
  playerCount: number;
}

export interface CreatePlayerRequest {
  name: string;
  pokemonId: number;
}

export interface CreatePlayerGameRequest {
  playerId: number;
  gameId: number;
}

export interface GameResponse {
  game: {
    id: number;
    name: string;
    playerCount: number;
  };
}
