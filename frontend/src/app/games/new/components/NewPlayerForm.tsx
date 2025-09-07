import { useState } from "react";
import { Pokemon } from "../interfaces/NewGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewPlayerFormProps {
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  pokemonSearch: string;
  setPokemonSearch: (search: string) => void;
  pokemons: Pokemon[];
  selectedPokemonName: string | null;
  onAddPlayer: () => void;
  onSelectPokemon: (id: number, name: string) => void;
  onFetchPokemons: (search: string) => void;
}

export function NewPlayerForm({
  newPlayerName,
  setNewPlayerName,
  pokemonSearch,
  setPokemonSearch,
  pokemons,
  selectedPokemonName,
  onAddPlayer,
  onSelectPokemon,
  onFetchPokemons,
}: NewPlayerFormProps) {
  const [open, setOpen] = useState(false);

  const handlePokemonSearch = (search: string) => {
    setPokemonSearch(search);
    onFetchPokemons(search);
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    onSelectPokemon(pokemon.id, pokemon.name);
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Entrenador</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPlayerName">Nombre del Entrenador</Label>
          <Input
            id="newPlayerName"
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nombre del entrenador"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Pokemon Inicial</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedPokemonName ? selectedPokemonName : "Buscar Pokemon..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar Pokemon..."
                  value={pokemonSearch}
                  onValueChange={handlePokemonSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {pokemonSearch.length < 3 
                      ? "Escribe al menos 3 caracteres para buscar" 
                      : "No se encontraron Pokemon"
                    }
                  </CommandEmpty>
                  <CommandGroup>
                    {pokemons.map((pokemon) => (
                      <CommandItem
                        key={pokemon.id}
                        value={pokemon.name}
                        onSelect={() => handleSelectPokemon(pokemon)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPokemonName === pokemon.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {pokemon.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {selectedPokemonName && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Pokemon seleccionado:</span>
            <Badge variant="secondary">{selectedPokemonName}</Badge>
          </div>
        )}

        <Button
          onClick={onAddPlayer}
          className="w-full flex items-center gap-2"
          disabled={!newPlayerName.trim() || !selectedPokemonName}
        >
          <Plus className="h-4 w-4" />
          Agregar Entrenador
        </Button>
      </CardContent>
    </Card>
  );
}
