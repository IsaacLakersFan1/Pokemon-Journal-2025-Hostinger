import { Event } from "../interfaces/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skull } from "lucide-react";
import { pokemonImageUrl } from "@/utils/pokemonImage";

interface GraveyardSectionProps {
  events: Event[];
}

export function GraveyardSection({ events }: GraveyardSectionProps) {
  const fallen = events
    .filter((e) => e.status === "Defeated")
    .sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() -
        new Date(a.updatedAt ?? a.createdAt ?? 0).getTime()
    );

  if (fallen.length === 0) {
    return null;
  }

  return (
    <Card className="border-red-200/80 bg-red-50/40 dark:border-red-900/50 dark:bg-red-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-400">
          <Skull className="h-5 w-5" />
          Cementerio ({fallen.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {fallen.map((event) => (
            <div
              key={event.id}
              className="flex flex-col items-center rounded-lg border bg-background/80 p-3 text-center"
            >
              <img
                src={pokemonImageUrl(event.pokemon?.image, {
                  shiny: !!event.isShiny,
                })}
                alt={event.nickname || event.pokemon?.name || "Pokémon"}
                className="h-16 w-16 object-contain opacity-80 grayscale"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
              <p className="mt-1 truncate text-sm font-semibold w-full">
                {event.nickname || event.pokemon?.name || "Sin nombre"}
              </p>
              <p className="truncate text-xs text-muted-foreground w-full">
                {event.player.name}
              </p>
              <Badge variant="outline" className="mt-1 text-[10px]">
                {event.route}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
