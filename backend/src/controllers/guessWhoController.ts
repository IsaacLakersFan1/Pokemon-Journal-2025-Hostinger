import { Request, Response } from "express";

const POKEAPI_BASE = "https://pokeapi.co/api/v2/pokemon";
const COUNT = 20;
const MAX_POKEMON_ID = 1025;

function getRandomIds(count: number): number[] {
  const ids: number[] = [];
  while (ids.length < count) {
    const id = Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
    if (!ids.includes(id)) ids.push(id);
  }
  return ids;
}

export const getRandomPokemons = async (_req: Request, res: Response): Promise<void> => {
  try {
    const ids = getRandomIds(COUNT);
    const results = await Promise.all(
      ids.map(async (id) => {
        const response = await fetch(`${POKEAPI_BASE}/${id}`);
        if (!response.ok) return null;
        const data = (await response.json()) as {
          id: number;
          name: string;
          types: Array<{ type: { name: string } }>;
          sprites?: {
            front_default?: string | null;
            other?: { "official-artwork"?: { front_default: string | null } };
          };
        };
        const image =
          data.sprites?.other?.["official-artwork"]?.front_default ??
          data.sprites?.front_default ??
          null;
        const types = data.types.map((t) => t.type.name);
        return {
          id: data.id,
          name: data.name,
          image,
          types,
        };
      })
    );
    const pokemons = results.filter((p): p is NonNullable<typeof p> => p !== null);
    res.status(200).json(pokemons);
  } catch (error) {
    console.error("Error fetching random Pokémon:", error);
    res.status(500).json({ message: "Error al obtener Pokémon aleatorios" });
  }
};
