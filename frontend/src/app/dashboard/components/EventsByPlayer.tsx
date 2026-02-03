import { useState } from "react";
import { Event } from "../interfaces/Dashboard";
import { ShowdownMatchup } from "../interfaces/Dashboard";
import { Player } from "../interfaces/Dashboard";
import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/button";
import { Check, Skull, ArrowRight } from "lucide-react";

interface EventsByPlayerProps {
  events: Event[];
  matchups?: ShowdownMatchup[];
  players?: Player[];
}

const EVENTS_PREVIEW_LIMIT = 5;

export function EventsByPlayer({ events, matchups: _matchups = [], players: _players = [] }: EventsByPlayerProps) {
  const [expandedPlayers, setExpandedPlayers] = useState<Set<number>>(new Set());

  const eventsReversed = [...events].sort(
    (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  );

  const eventsByPlayer = eventsReversed.reduce((acc: { [key: number]: Event[] }, event) => {
    const playerId = event.player.id;
    if (!acc[playerId]) acc[playerId] = [];
    acc[playerId].push(event);
    return acc;
  }, {});

  const playerCount = Object.keys(eventsByPlayer).length;
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

  const getCounts = (playerId: number) => {
    const list = eventsByPlayer[playerId] ?? [];
    return {
      catched: list.filter((e) => e.status === "Catched").length,
      defeated: list.filter((e) => e.status === "Defeated").length,
      runAway: list.filter((e) => e.status === "Run Away").length,
    };
  };

  const toggleExpanded = (playerId: number) => {
    setExpandedPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) next.delete(playerId);
      else next.add(playerId);
      return next;
    });
  };

  return (
    <div className="mt-8">
      <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
        {Object.keys(eventsByPlayer).map((playerIdKey) => {
          const playerId = Number(playerIdKey);
          const list = eventsByPlayer[playerId];
          const playerName = list[0]?.player.name ?? "";
          const counts = getCounts(playerId);
          const isExpanded = expandedPlayers.has(playerId);
          const displayList = isExpanded ? list : list.slice(0, EVENTS_PREVIEW_LIMIT);
          const hasMore = list.length > EVENTS_PREVIEW_LIMIT;

          return (
            <div key={playerId} className="border rounded-lg p-4 bg-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-indigo-600">{playerName}</h3>
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
    
              <div className="space-y-4">
                {displayList.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDelete={() => window.location.reload()}
                  />
                ))}
              </div>
              {hasMore && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => toggleExpanded(playerId)}
                >
                  {isExpanded ? "Mostrar menos" : "Mostrar todos"}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
