import { PokemonCard } from "./PokemonCard";
import { Pokemon } from "../interfaces/PlayerStats";

interface PokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick?: (pokemonId: number) => void;
}

export function PokemonGrid({ pokemons, onPokemonClick }: PokemonGridProps) {
  if (pokemons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron Pokemon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={`${pokemon.id}-${pokemon.name}-${pokemon.form}`}
          pokemon={pokemon}
          onClick={onPokemonClick ? () => onPokemonClick(pokemon.id) : undefined}
        />
      ))}
    </div>
  );
}
