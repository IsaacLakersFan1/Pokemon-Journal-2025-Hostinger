import { useMemo } from "react";
import { Event, Player, ShowdownMatchup } from "../interfaces/Dashboard";
import { pokemonImageUrl } from "@/utils/pokemonImage";
import { buildStandings } from "../utils/runHelpers";
import { Crown, Skull, Trophy } from "lucide-react";

interface HallOfFameProps {
  gameName: string;
  pokemonGame?: string | null;
  players: Player[];
  events: Event[];
  matchups: ShowdownMatchup[];
}

export function HallOfFame({
  gameName,
  pokemonGame,
  players,
  events,
  matchups,
}: HallOfFameProps) {
  const champs = useMemo(
    () => events.filter((e) => e.isChamp),
    [events]
  );
  const fallen = useMemo(
    () => events.filter((e) => e.status === "Defeated"),
    [events]
  );
  const standings = useMemo(
    () => buildStandings(players, matchups),
    [players, matchups]
  );
  const totalShowdowns = matchups.reduce(
    (acc, m) => acc + m.showdowns.length,
    0
  );

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header className="space-y-2 border-b pb-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Salón de la fama
        </p>
        <h2 className="text-3xl font-semibold tracking-tight">{gameName}</h2>
        {pokemonGame && (
          <p className="text-muted-foreground">{pokemonGame}</p>
        )}
      </header>

      <section className="space-y-4">
        <h3 className="flex items-center justify-center gap-2 text-lg font-medium">
          <Crown className="h-5 w-5 text-yellow-600" />
          Campeones
        </h3>
        {champs.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Aún no hay Pokémon marcados como campeón.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {champs.map((e) => (
              <div key={e.id} className="w-28 text-center">
                <img
                  src={pokemonImageUrl(e.pokemon?.image, {
                    shiny: !!e.isShiny,
                  })}
                  alt=""
                  className="mx-auto h-20 w-20 object-contain"
                />
                <p className="mt-2 truncate text-sm font-medium">
                  {e.nickname || e.pokemon?.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {e.player.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="flex items-center justify-center gap-2 text-lg font-medium">
          <Trophy className="h-5 w-5" />
          Showdowns
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Combates" value={totalShowdowns} />
          <Stat
            label="Líder"
            value={standings[0]?.name ?? "—"}
          />
          <Stat
            label="Pts líder"
            value={standings[0] ? String(standings[0].points) : "—"}
          />
          <Stat
            label="Más MVP"
            value={
              [...standings].sort((a, b) => b.mvpCount - a.mvpCount)[0]
                ?.mvpCount
                ? [...standings].sort((a, b) => b.mvpCount - a.mvpCount)[0].name
                : "—"
            }
          />
        </div>
        {standings.length > 0 && (
          <ol className="mx-auto max-w-sm space-y-1 text-sm">
            {standings.map((s, i) => (
              <li
                key={s.playerId}
                className="flex justify-between border-b border-dashed py-1.5"
              >
                <span>
                  {i + 1}. {s.name}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {s.wins}–{s.losses} · {s.points} pts
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="flex items-center justify-center gap-2 text-lg font-medium text-red-700 dark:text-red-400">
          <Skull className="h-5 w-5" />
          Recordados ({fallen.length})
        </h3>
        {fallen.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Nadie ha caído… todavía.
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            {fallen.map((e) => (
              <div key={e.id} className="w-24 text-center opacity-80">
                <img
                  src={pokemonImageUrl(e.pokemon?.image)}
                  alt=""
                  className="mx-auto h-14 w-14 object-contain grayscale"
                />
                <p className="mt-1 truncate text-xs font-medium">
                  {e.nickname || e.pokemon?.name}
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {e.player.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border px-3 py-3 text-center">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
