export interface Player {
  id: number;
  name: string;
  pokemonId?: number;
  userId: number;
}

export interface PlayerGameResponse {
  id: number;
  playerId: number;
  gameId: number;
  player: Player;
}

export interface Pokemon {
  id: number;
  name: string;
  form?: string;
  image?: string;
}

export interface Event {
  id: number;
  pokemonId: number | null;
  route: string;
  nickname?: string;
  status: string;
  isShiny: number;
  isChamp: number;
  gameId: number;
  createdAt?: string;
  player: Player;
  pokemon: {
    id: number;
    name: string;
    form?: string;
    image?: string;
    type1: string;
    type2?: string;
    total: number;
  } | null;
}

export interface CreateEventRequest {
  pokemonId: number;
  pokemonImage: string;
  route: string;
  nickname: string;
  playerId: number;
  status: string;
  gameId: number;
}

export interface ShowdownMatchup {
  player1Id: number;
  player2Id: number;
  player1Name: string;
  player2Name: string;
  player1Points: number;
  player2Points: number;
  showdowns: ShowdownRecord[];
}

export interface ShowdownRecord {
  id: number;
  gameId: number;
  player1Id: number;
  player2Id: number;
  winnerId: number;
  player1EventIds: string;
  player2EventIds: string;
  mvpEventId: number | null;
  createdAt: string;
  player1: Player;
  player2: Player;
  winner: Player;
  mvpEvent?: Event | null;
}
