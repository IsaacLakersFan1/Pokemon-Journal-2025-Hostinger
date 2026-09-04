import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pokemonImageUrl } from "@/utils/pokemonImage";
import { Search as SearchIcon, Loader2 } from "lucide-react";

interface SearchGame {
  id: number;
  name: string;
  pokemonGame: string | null;
  updatedAt: string;
}

interface SearchEvent {
  id: number;
  nickname: string | null;
  route: string;
  status: string | null;
  pokemon: { id: number; name: string; image: string | null } | null;
  player: { id: number; name: string };
  game: { id: number; name: string };
}

export function SearchPage() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<SearchGame[]>([]);
  const [events, setEvents] = useState<SearchEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 300);
    return () => window.clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (debounced.length < 2) {
      setGames([]);
      setEvents([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/search`, {
          params: { q: debounced },
          withCredentials: true,
        });
        if (!cancelled) {
          setGames(res.data.games ?? []);
          setEvents(res.data.events ?? []);
        }
      } catch {
        if (!cancelled) {
          setGames([]);
          setEvents([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Buscar</h1>
          <p className="mt-1 text-muted-foreground">
            Solo en tus runs: juegos, apodos, rutas y Pokémon
          </p>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Escribe al menos 2 caracteres…"
            className="pl-9"
            autoFocus
          />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Buscando…
          </div>
        )}

        {!loading && debounced.length >= 2 && games.length === 0 && events.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin resultados.</p>
        )}

        {games.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">Runs</h2>
            <ul className="divide-y rounded-lg border">
              {games.map((g) => (
                <li key={g.id}>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-none px-4 py-3"
                    onClick={() => navigate(`/games/${g.id}/dashboard`)}
                  >
                    <div className="text-left">
                      <p className="font-medium">{g.name}</p>
                      {g.pokemonGame && (
                        <p className="text-xs text-muted-foreground">
                          {g.pokemonGame}
                        </p>
                      )}
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {events.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Encuentros
            </h2>
            <ul className="divide-y rounded-lg border">
              {events.map((e) => (
                <li key={e.id}>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-none px-4 py-3"
                    onClick={() =>
                      navigate(`/games/${e.game.id}/dashboard`)
                    }
                  >
                    <img
                      src={pokemonImageUrl(e.pokemon?.image)}
                      alt=""
                      className="h-10 w-10 object-contain"
                    />
                    <div className="min-w-0 text-left">
                      <p className="truncate font-medium">
                        {e.nickname || e.pokemon?.name || "Sin nombre"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {e.player.name} · {e.route} · {e.game.name}
                      </p>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
