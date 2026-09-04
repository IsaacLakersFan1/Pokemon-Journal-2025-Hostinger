import { useMemo, useState } from "react";
import { PokemonCard } from "./PokemonCard";
import { Pokemon } from "../interfaces/PlayerStats";
import {
  PokemonListFilters,
  defaultPokemonListFilters,
  filterAndSortPokemons,
  useAvailableTypes,
  PokemonListFiltersState,
} from "./PokemonListFilters";

interface PokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick?: (pokemonId: number) => void;
}

export function PokemonGrid({ pokemons, onPokemonClick }: PokemonGridProps) {
  const [filters, setFilters] = useState<PokemonListFiltersState>(
    defaultPokemonListFilters
  );
  const availableTypes = useAvailableTypes(pokemons);
  const filtered = useMemo(
    () => filterAndSortPokemons(pokemons, filters),
    [pokemons, filters]
  );

  return (
    <div>
      <PokemonListFilters
        filters={filters}
        onChange={setFilters}
        availableTypes={availableTypes}
        resultCount={filtered.length}
        totalCount={pokemons.length}
      />

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            No hay Pokémon con estos filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((pokemon) => (
            <PokemonCard
              key={`${pokemon.id}-${pokemon.name}-${pokemon.form}`}
              pokemon={pokemon}
              onClick={
                onPokemonClick ? () => onPokemonClick(pokemon.id) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
