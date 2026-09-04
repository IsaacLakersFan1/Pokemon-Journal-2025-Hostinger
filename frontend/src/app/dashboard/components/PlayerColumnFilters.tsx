import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Star, Crown, X } from "lucide-react";
import {
  EventStatusFilter,
  PlayerEventFilters,
} from "../utils/runHelpers";

interface PlayerColumnFiltersProps {
  filters: PlayerEventFilters;
  onChange: (next: PlayerEventFilters) => void;
}

const STATUSES: { value: EventStatusFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "Catched", label: "Vivos" },
  { value: "Defeated", label: "Caídos" },
  { value: "Run Away", label: "Huyeron" },
];

export function PlayerColumnFilters({
  filters,
  onChange,
}: PlayerColumnFiltersProps) {
  const hasActive =
    filters.status !== "all" ||
    filters.shinyOnly ||
    filters.champOnly ||
    filters.query.trim().length > 0;

  return (
    <div className="mb-3 space-y-2 border-b pb-3">
      <div className="flex flex-wrap gap-1">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange({ ...filters, status: s.value })}
            className={cn(
              "rounded-md px-2 py-0.5 text-xs transition-colors",
              filters.status === s.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, shinyOnly: !filters.shinyOnly })
          }
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors",
            filters.shinyOnly
              ? "bg-amber-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Star className="h-3 w-3" />
          Shiny
        </button>
        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, champOnly: !filters.champOnly })
          }
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors",
            filters.champOnly
              ? "bg-yellow-600 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Crown className="h-3 w-3" />
          Champ
        </button>
      </div>
      <div className="flex gap-1">
        <Input
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Buscar apodo, ruta…"
          className="h-8 text-xs"
        />
        {hasActive && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            title="Limpiar filtros"
            onClick={() =>
              onChange({
                status: "all",
                shinyOnly: false,
                champOnly: false,
                query: "",
              })
            }
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
