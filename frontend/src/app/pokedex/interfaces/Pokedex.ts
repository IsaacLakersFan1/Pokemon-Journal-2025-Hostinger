export interface Pokemon {
  id: number;
  nationalDex: number;
  name: string;
  form: string | null;
  type1: string;
  type2?: string | null;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  generation: number;
  image: string;
  shinyImage: string;
}

export interface TypeEffectiveness {
  [key: string]: number;
}
