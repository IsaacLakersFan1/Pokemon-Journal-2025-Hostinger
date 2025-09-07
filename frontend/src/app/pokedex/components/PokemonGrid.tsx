import { PokedexCard } from "./PokedexCard";
import { Pokemon } from "../interfaces/Pokedex";

interface PokemonGridProps {
  pokemons: Pokemon[];
  onInfoClick: (pokemon: Pokemon) => void;
  onEditClick: (pokemon: Pokemon) => void;
}

export function PokemonGrid({ pokemons, onInfoClick, onEditClick }: PokemonGridProps) {
  if (pokemons.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No se encontraron Pokémon.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pokemons.map((pokemon) => (
        <PokedexCard
          key={pokemon.id}
          pokemon={pokemon}
          onInfoClick={onInfoClick}
          onEditClick={onEditClick}
        />
      ))}
    </div>
  );
}
