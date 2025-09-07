import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pokemon, Player } from "../interfaces/Dashboard";

interface CreateEventFormProps {
  pokemonQuery: string;
  setPokemonQuery: (query: string) => void;
  pokemonResults: Pokemon[];
  selectedPokemon: Pokemon | null;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  route: string;
  setRoute: (route: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  players: Player[];
  selectedPlayerId: number | null;
  setSelectedPlayerId: (id: number | null) => void;
  status: string;
  setStatus: (status: string) => void;
  isSubmitting: boolean;
  onCreateEvent: () => void;
}

export function CreateEventForm({
  pokemonQuery,
  setPokemonQuery,
  pokemonResults,
  selectedPokemon,
  setSelectedPokemon,
  route,
  setRoute,
  nickname,
  setNickname,
  players,
  selectedPlayerId,
  setSelectedPlayerId,
  status,
  setStatus,
  isSubmitting,
  onCreateEvent,
}: CreateEventFormProps) {
  const [isPokemonOpen, setIsPokemonOpen] = useState(false);

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setPokemonQuery("");
    setIsPokemonOpen(false);
  };

  return (
    <div className="space-y-4">
        {/* Pokemon Search */}
        <div className="space-y-2">
          <Label htmlFor="pokemon">Buscar Pokemon</Label>
          <Popover open={isPokemonOpen} onOpenChange={setIsPokemonOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPokemonOpen}
                className="w-full justify-between"
              >
                {selectedPokemon ? selectedPokemon.name : "Seleccionar Pokemon..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar Pokemon..."
                  value={pokemonQuery}
                  onValueChange={setPokemonQuery}
                />
                <CommandList>
                  <CommandEmpty>No se encontraron Pokemon.</CommandEmpty>
                  <CommandGroup>
                    {pokemonResults.map((pokemon) => (
                      <CommandItem
                        key={pokemon.id}
                        value={`${pokemon.name} ${pokemon.form || ''}`}
                        onSelect={() => handlePokemonSelect(pokemon)}
                        className="flex items-center space-x-3"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedPokemon?.id === pokemon.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <img
                          src={pokemon.image ? `http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${pokemon.image}.png` : 'https://github.com/shadcn.png'}
                          alt={pokemon.name}
                          className="w-8 h-8 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = 'https://github.com/shadcn.png';
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{pokemon.name}</span>
                          {pokemon.form && <span className="text-xs text-muted-foreground">{pokemon.form}</span>}
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Selected Pokemon Display */}
        {selectedPokemon && (
          <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
            <img
              src={selectedPokemon.image ? `http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${selectedPokemon.image}.png` : 'https://github.com/shadcn.png'}
              alt={selectedPokemon.name}
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://github.com/shadcn.png';
              }}
            />
            <div className="text-center">
              <p className="font-semibold text-lg">{selectedPokemon.name}</p>
              {selectedPokemon.form && (
                <p className="text-sm text-muted-foreground">{selectedPokemon.form}</p>
              )}
            </div>
          </div>
        )}

        {/* Route Input */}
        <div className="space-y-2">
          <Label htmlFor="route">Zona/Ruta</Label>
          <Input
            id="route"
            placeholder="Ingresa la zona o ruta"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
          />
        </div>

        {/* Nickname Input */}
        <div className="space-y-2">
          <Label htmlFor="nickname">Apodo</Label>
          <Input
            id="nickname"
            placeholder="Ingresa el apodo"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        {/* Player Selection */}
        <div className="space-y-2">
          <Label htmlFor="player">Entrenador que atrapó el Pokemon</Label>
          <Select value={selectedPlayerId?.toString() || ""} onValueChange={(value) => setSelectedPlayerId(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un entrenador" />
            </SelectTrigger>
            <SelectContent>
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id.toString()}>
                  {player.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Selection */}
        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Catched">Atrapado</SelectItem>
              <SelectItem value="Run Away">Huyó</SelectItem>
              <SelectItem value="Defeated">Derrotado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button
          onClick={onCreateEvent}
          disabled={isSubmitting || !selectedPokemon || !route || !nickname || !selectedPlayerId}
          className="w-full"
        >
          {isSubmitting ? "Creando..." : "Crear Evento"}
        </Button>
    </div>
  );
}
