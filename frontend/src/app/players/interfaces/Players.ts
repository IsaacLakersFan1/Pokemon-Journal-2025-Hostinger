export interface Player {
  id: number;
  name: string;
  pokemon: {
    name: string;
    image: string;
  } | null;
}

export interface PlayerGameResponse {
  player: Player;
}
