import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import API_URL from "@/utils/apiConfig";
import axios from "axios";
import { toastError } from "@/hooks/useToastError";
import { Sparkles } from "lucide-react";

export interface GuessWhoPokemon {
  id: number;
  name: string;
  image: string | null;
  types: string[];
}

export function GuessWhoPage() {
  const [pokemons, setPokemons] = useState<GuessWhoPokemon[]>([]);
  const [crossedOutIds, setCrossedOutIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const { showToastError } = toastError();

  const handleGenerate = async () => {
    setLoading(true);
    setCrossedOutIds(new Set());
    try {
      const response = await axios.get<GuessWhoPokemon[]>(
        `${API_URL}/api/guess-who/pokemons`,
        { withCredentials: true }
      );
      setPokemons(response.data ?? []);
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al generar Pokémon";
      showToastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleCrossed = (id: number) => {
    setCrossedOutIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Guess Who</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Genera 20 Pokémon al azar. Haz clic en uno para tacharlo, como en una divina.
        </p>
        <Button
          onClick={handleGenerate}
          disabled={loading}
          size="lg"
          className="gap-2"
        >
          <Sparkles className="h-5 w-5" />
          {loading ? "Generando..." : "Generar"}
        </Button>
      </div>

      {pokemons.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pokemons.map((pokemon) => {
            const isCrossed = crossedOutIds.has(pokemon.id);
            return (
              <Card
                key={pokemon.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isCrossed ? "opacity-50 ring-2 ring-muted" : ""
                }`}
                onClick={() => toggleCrossed(pokemon.id)}
              >
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {pokemon.image ? (
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className={`w-full h-full object-contain ${isCrossed ? "grayscale" : ""}`}
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">Sin imagen</span>
                    )}
                    {isCrossed && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        aria-hidden
                      >
                        <div className="w-full border-b-4 border-red-500 rotate-[-12deg]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`font-medium text-center capitalize ${
                      isCrossed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {pokemon.name}
                  </span>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {pokemon.types.map((t) => (
                      <Badge key={t} variant="secondary" className="capitalize text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
