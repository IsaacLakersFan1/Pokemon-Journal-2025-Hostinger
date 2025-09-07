export interface TypeCounts {
  [key: string]: number;
}

export interface PlayerStats {
  playerName: string;
  caught: number;
  runaway: number;
  defeated: number;
  shiny: number;
  typeCounts: TypeCounts;
}

export interface Pokemon {
  id: number;
  name: string;
  form: string;
  image: string | null;
  shinyImage: string | null;
  timesCaptured: number;
  shinyCapture: string; // 'yes' or 'no'
  type1: string;
  type2: string;
}
