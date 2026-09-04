import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, ChevronsUpDown, Star, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Pokemon, Player, Event } from "../interfaces/Dashboard";
import { pokemonImageUrl } from "@/utils/pokemonImage";
import { claimedSpeciesKeys, speciesKey } from "../utils/runHelpers";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  isShiny: boolean;
  setIsShiny: (value: boolean) => void;
  isChamp: boolean;
  setIsChamp: (value: boolean) => void;
  isSubmitting: boolean;
  onCreateEvent: () => void;
  existingEvents?: Event[];
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
  isShiny,
  setIsShiny,
  isChamp,
  setIsChamp,
  isSubmitting,
  onCreateEvent,
  existingEvents = [],
}: CreateEventFormProps) {
  const [isPokemonOpen, setIsPokemonOpen] = useState(false);

  const claimed = claimedSpeciesKeys(existingEvents);
  const isDupe =
    selectedPokemon &&
    (status === "Catched" || status === "Defeated") &&
    claimed.has(speciesKey(selectedPokemon.name, selectedPokemon.form));

  const handlePokemonSelect = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setPokemonQuery("");
    setIsPokemonOpen(false);
    if (!nickname.trim()) {
      setNickname(pokemon.name);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pokemon">Buscar Pokémon</Label>
        <Popover open={isPokemonOpen} onOpenChange={setIsPokemonOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isPokemonOpen}
              className="w-full justify-between"
            >
              {selectedPokemon ? selectedPokemon.name : "Seleccionar Pokémon…"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput
                placeholder="Buscar Pokémon…"
                value={pokemonQuery}
                onValueChange={setPokemonQuery}
              />
              <CommandList>
                <CommandEmpty>No se encontraron Pokémon.</CommandEmpty>
                <CommandGroup>
                  {pokemonResults.map((pokemon) => (
                    <CommandItem
                      key={pokemon.id}
                      value={`${pokemon.name} ${pokemon.form || ""}`}
                      onSelect={() => handlePokemonSelect(pokemon)}
                      className="flex items-center space-x-3"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedPokemon?.id === pokemon.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <img
                        src={pokemonImageUrl(pokemon.image)}
                        alt={pokemon.name}
                        className="h-8 w-8 object-contain"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{pokemon.name}</span>
                        {pokemon.form && (
                          <span className="text-xs text-muted-foreground">
                            {pokemon.form}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedPokemon && (
        <div className="flex items-center space-x-4 rounded-lg bg-muted p-4">
          <img
            src={pokemonImageUrl(selectedPokemon.image)}
            alt={selectedPokemon.name}
            className="h-16 w-16 object-contain"
          />
          <div>
            <p className="text-lg font-semibold">{selectedPokemon.name}</p>
            {selectedPokemon.form && (
              <p className="text-sm text-muted-foreground">
                {selectedPokemon.form}
              </p>
            )}
          </div>
        </div>
      )}

      {isDupe && (
        <Alert>
          <AlertDescription>
            Dupes clause: <strong>{selectedPokemon?.name}</strong> ya tuvo un
            encuentro usado en este run (atrapado o caído). Puedes registrarlo
            igual si tus reglas lo permiten.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="route">Zona / ruta</Label>
        <Input
          id="route"
          placeholder="Ej. Route 104, Petalburg Woods…"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nickname">Apodo (opcional)</Label>
        <Input
          id="nickname"
          placeholder="Si lo dejas vacío se usa el nombre del Pokémon"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="player">Entrenador</Label>
        <Select
          value={selectedPlayerId?.toString() || ""}
          onValueChange={(value) => setSelectedPlayerId(Number(value))}
        >
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

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isShiny}
            onCheckedChange={(v) => setIsShiny(v === true)}
          />
          <Star className="h-4 w-4 text-amber-500" />
          Shiny
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={isChamp}
            onCheckedChange={(v) => setIsChamp(v === true)}
          />
          <Crown className="h-4 w-4 text-yellow-600" />
          Campeón del run
        </label>
      </div>

      <Button
        onClick={onCreateEvent}
        disabled={
          isSubmitting || !selectedPokemon || !route || !selectedPlayerId
        }
        className="w-full"
      >
        {isSubmitting ? "Creando…" : "Registrar encuentro"}
      </Button>
    </div>
  );
}
