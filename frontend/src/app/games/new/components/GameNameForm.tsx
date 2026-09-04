import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameNameFormProps {
  gameName: string;
  setGameName: (name: string) => void;
  pokemonGame?: string;
  setPokemonGame?: (value: string) => void;
  notes?: string;
  setNotes?: (value: string) => void;
}

export function GameNameForm({
  gameName,
  setGameName,
  pokemonGame = "",
  setPokemonGame,
  notes = "",
  setNotes,
}: GameNameFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Run</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gameName">Nombre del run</Label>
          <Input
            id="gameName"
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Ej. Nuzlocke Emerald con los panas"
            className="w-full"
          />
        </div>
        {setPokemonGame && (
          <div className="space-y-2">
            <Label htmlFor="pokemonGame">Juego de Pokémon</Label>
            <Input
              id="pokemonGame"
              type="text"
              value={pokemonGame}
              onChange={(e) => setPokemonGame(e.target.value)}
              placeholder="Ej. Emerald, HeartGold, Scarlet…"
              className="w-full"
            />
          </div>
        )}
        {setNotes && (
          <div className="space-y-2">
            <Label htmlFor="notes">Reglas / notas del run</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dupes clause, shiny clause, set mode, lo que acuerden…"
              className="min-h-24 w-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
