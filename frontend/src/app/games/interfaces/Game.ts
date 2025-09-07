export interface Game {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  userId: number;
}

export interface CreateGameRequest {
  name: string;
}

export interface GameResponse {
  games: Game[];
}
