import { useMemo, useState } from "react";
import { Event, Player } from "../interfaces/Dashboard";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Check, Skull, ArrowRight } from "lucide-react";
import { PlayerColumnFilters } from "./PlayerColumnFilters";
import {
  defaultPlayerFilters,
  filterEvents,
  PlayerEventFilters,
} from "../utils/runHelpers";

interface EventsByPlayerProps {
  events: Event[];
  players: Player[];
  onRefresh?: () => void | Promise<void>;
}

const EVENTS_PREVIEW_LIMIT = 5;

export function EventsByPlayer({
  events,
  players,
  onRefresh,
}: EventsByPlayerProps) {
  const [expandedPlayers, setExpandedPlayers] = useState<Set<number>>(
    new Set()
  );
  const [filtersByPlayer, setFiltersByPlayer] = useState<
    Record<number, PlayerEventFilters>
  >({});

  const playerIds = useMemo(() => {
    const fromEvents = new Set(events.map((e) => e.player.id));
    const ids = players.map((p) => p.id);
    for (const id of fromEvents) {
      if (!ids.includes(id)) ids.push(id);
    }
    return ids;
  }, [events, players]);

  const playerCount = playerIds.length;
  const gridColsClass =
    playerCount === 2
      ? "md:grid-cols-2"
      : playerCount === 3
        ? "md:grid-cols-3"
        : playerCount === 4
          ? "md:grid-cols-4"
          : playerCount >= 5
            ? "md:grid-cols-5"
            : "";

  const getFilters = (playerId: number) =>
    filtersByPlayer[playerId] ?? defaultPlayerFilters();

  const setFilters = (playerId: number, next: PlayerEventFilters) => {
    setFiltersByPlayer((prev) => ({ ...prev, [playerId]: next }));
  };

  return (
    <div className={`grid grid-cols-1 gap-4 ${gridColsClass}`}>
      {playerIds.map((playerId) => {
        const player =
          players.find((p) => p.id === playerId) ||
          events.find((e) => e.player.id === playerId)?.player;
        const allForPlayer = events
          .filter((e) => e.player.id === playerId)
          .sort(
            (a, b) =>
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
          );
        const filters = getFilters(playerId);
        const filtered = filterEvents(allForPlayer, filters);
        const isExpanded = expandedPlayers.has(playerId);
        const displayList = isExpanded
          ? filtered
          : filtered.slice(0, EVENTS_PREVIEW_LIMIT);
        const hasMore = filtered.length > EVENTS_PREVIEW_LIMIT;

        const counts = {
          catched: allForPlayer.filter((e) => e.status === "Catched").length,
          defeated: allForPlayer.filter((e) => e.status === "Defeated").length,
          runAway: allForPlayer.filter((e) => e.status === "Run Away").length,
        };

        return (
          <div key={playerId} className="rounded-lg border bg-card p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-indigo-600">
                {player?.name ?? `Jugador #${playerId}`}
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1" title="Capturados">
                  <Check className="h-4 w-4 text-green-600" />
                  {counts.catched}
                </span>
                <span className="flex items-center gap-1" title="Derrotados">
                  <Skull className="h-4 w-4 text-red-600" />
                  {counts.defeated}
                </span>
                <span className="flex items-center gap-1" title="Escaparon">
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                  {counts.runAway}
                </span>
              </div>
            </div>

            <PlayerColumnFilters
              filters={filters}
              onChange={(next) => setFilters(playerId, next)}
            />

            <div className="space-y-3">
              {displayList.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Sin eventos con estos filtros
                </p>
              )}
              {displayList.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDelete={() => {
                    void onRefresh?.();
                  }}
                  onChange={() => {
                    void onRefresh?.();
                  }}
                />
              ))}
            </div>
            {hasMore && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() =>
                  setExpandedPlayers((prev) => {
                    const next = new Set(prev);
                    if (next.has(playerId)) next.delete(playerId);
                    else next.add(playerId);
                    return next;
                  })
                }
              >
                {isExpanded
                  ? "Mostrar menos"
                  : `Mostrar todos (${filtered.length})`}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
