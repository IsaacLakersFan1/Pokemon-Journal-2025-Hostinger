export interface GlobalPlayer {
  id: number;
  name: string;
  pokemon: {
    name: string;
    image: string;
  } | null;
}
