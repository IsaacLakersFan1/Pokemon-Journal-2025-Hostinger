import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Swords, Trophy, Star, Skull, ArrowRight, Crown } from "lucide-react";
import API_URL from "@/utils/apiConfig";
import axios from "axios";

interface EventByGame {
  eventId: number;
  nickname: string | null;
  status: string | null;
  isShiny: number;
  isChamp: number;
  mvpCountInGame: number;
}

interface GameDetail {
  gameId: number;
  gameName: string;
  events: EventByGame[];
}

interface PokemonDetailData {
  pokemon: { id: number; name: string; form: string | null; type1: string; type2: string | null; image: string | null; shinyImage: string | null } | null;
  showdownBattles: number;
  showdownWins: number;
  mvpCount: number;
  leagueWins: number;
  defeatedCount: number;
  escapedCount: number;
  timesCaptured: number;
  eventsByGame: GameDetail[];
}

interface PokemonDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playerId: number;
  pokemonId: number;
}

const getTypeColor = (type: string): string => {
  const map: Record<string, string> = {
    Bug: "#A8B820", Dark: "#705848", Dragon: "#6F35FC", Electric: "#F8D030",
    Fairy: "#F7A5D4", Fighting: "#C03028", Fire: "#F08030", Flying: "#A890F0",
    Ghost: "#705898", Grass: "#78C850", Ground: "#E0C068", Ice: "#98D8D8",
    Normal: "#A8A878", Poison: "#A040A0", Psychic: "#F85888", Rock: "#B8A038",
    Steel: "#B8B8D0", Water: "#6890F0",
  };
  return map[type] ?? "#808080";
};

export function PokemonDetailModal({
  open,
  onOpenChange,
  playerId,
  pokemonId,
}: PokemonDetailModalProps) {
  const [data, setData] = useState<PokemonDetailData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !playerId || !pokemonId) return;
    setLoading(true);
    axios
      .get(`${API_URL}/api/players/${playerId}/pokemon/${pokemonId}/detail`, {
        withCredentials: true,
      })
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [open, playerId, pokemonId]);

  if (!data && !loading) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalle del Pokémon</DialogTitle>
        </DialogHeader>
        {loading && <p className="text-muted-foreground">Cargando...</p>}
        {data && data.pokemon && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {data.pokemon.image && (
                <img
                  src={`http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${data.pokemon.image}.png`}
                  alt={data.pokemon.name}
                  className="w-24 h-24 object-contain"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{data.pokemon.name}</h3>
                {data.pokemon.form && <p className="text-sm text-muted-foreground">{data.pokemon.form}</p>}
                <div className="flex gap-2 mt-2">
                  <Badge style={{ backgroundColor: getTypeColor(data.pokemon.type1) }} className="text-white">{data.pokemon.type1}</Badge>
                  {data.pokemon.type2 && <Badge style={{ backgroundColor: getTypeColor(data.pokemon.type2) }} className="text-white">{data.pokemon.type2}</Badge>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-2 border rounded">
                <Swords className="h-5 w-5" />
                <span>Showdown: {data.showdownBattles}</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Victorias: {data.showdownWins}</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <Star className="h-5 w-5" />
                <span>MVP: {data.mvpCount}</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <Crown className="h-5 w-5" />
                <span>Liga: {data.leagueWins}</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <Skull className="h-5 w-5 text-red-600" />
                <span>Derrotados: {data.defeatedCount}</span>
              </div>
              <div className="flex items-center gap-2 p-2 border rounded">
                <ArrowRight className="h-5 w-5 text-gray-600" />
                <span>Escaparon: {data.escapedCount}</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Por juego</h4>
              <div className="space-y-4">
                {data.eventsByGame.map((g) => (
                  <div key={g.gameId} className="border rounded p-3 bg-muted/30">
                    <p className="font-medium mb-2">{g.gameName}</p>
                    <ul className="space-y-2 text-sm">
                      {g.events.map((e) => (
                        <li key={e.eventId} className="flex flex-wrap items-center gap-2">
                          <span>{e.nickname || "(sin apodo)"}</span>
                          <Badge variant="secondary">{e.status ?? "—"}</Badge>
                          {e.isShiny === 1 && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          {e.isChamp === 1 && <Crown className="h-4 w-4" />}
                          <span className="text-muted-foreground">MVP en juego: {e.mvpCountInGame}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
