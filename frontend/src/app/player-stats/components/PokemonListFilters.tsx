import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Star, Swords, Trophy, X } from "lucide-react";
import { Pokemon } from "../interfaces/PlayerStats";

export type CaptureFilter = "all" | "captured" | "uncaptured";
export type SortFilter =
  | "name"
  | "captures"
  | "showdowns"
  | "mvp";

export interface PokemonListFiltersState {
  query: string;
  capture: CaptureFilter;
  shinyOnly: boolean;
  showdownOnly: boolean;
  mvpOnly: boolean;
  type: string; // "all" or type name
  sort: SortFilter;
}

export const defaultPokemonListFilters = (): PokemonListFiltersState => ({
  query: "",
  capture: "all",
  shinyOnly: false,
  showdownOnly: false,
  mvpOnly: false,
  type: "all",
  sort: "name",
});

const TYPES = [
  "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying",
  "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock",
  "Steel", "Water",
];

interface PokemonListFiltersProps {
  filters: PokemonListFiltersState;
  onChange: (next: PokemonListFiltersState) => void;
  availableTypes?: string[];
  resultCount: number;
  totalCount: number;
}

export function PokemonListFilters({
  filters,
  onChange,
  availableTypes,
  resultCount,
  totalCount,
}: PokemonListFiltersProps) {
  const typeOptions = availableTypes?.length ? availableTypes : TYPES;

  const hasActive =
    filters.query.trim().length > 0 ||
    filters.capture !== "all" ||
    filters.shinyOnly ||
    filters.showdownOnly ||
    filters.mvpOnly ||
    filters.type !== "all" ||
    filters.sort !== "name";

  return (
    <div className="mb-6 space-y-3 rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Mostrando {resultCount} de {totalCount}
        </p>
        {hasActive && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={() => onChange(defaultPokemonListFilters())}
          >
            <X className="h-3.5 w-3.5" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Buscar por nombre o forma…"
          className="sm:max-w-xs"
        />
        <Select
          value={filters.capture}
          onValueChange={(v) =>
            onChange({ ...filters, capture: v as CaptureFilter })
          }
        >
          <SelectTrigger className="sm:w-[160px]">
            <SelectValue placeholder="Captura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="captured">Capturados</SelectItem>
            <SelectItem value="uncaptured">No capturados</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.type}
          onValueChange={(v) => onChange({ ...filters, type: v })}
        >
          <SelectTrigger className="sm:w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquier tipo</SelectItem>
            {typeOptions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.sort}
          onValueChange={(v) =>
            onChange({ ...filters, sort: v as SortFilter })
          }
        >
          <SelectTrigger className="sm:w-[170px]">
            <SelectValue placeholder="Orden" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="captures">Más capturas</SelectItem>
            <SelectItem value="showdowns">Más wins SD</SelectItem>
            <SelectItem value="mvp">Más MVP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() =>
            onChange({ ...filters, shinyOnly: !filters.shinyOnly })
          }
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors",
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
            onChange({ ...filters, showdownOnly: !filters.showdownOnly })
          }
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors",
            filters.showdownOnly
              ? "bg-indigo-600 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Swords className="h-3 w-3" />
          Con wins SD
        </button>
        <button
          type="button"
          onClick={() => onChange({ ...filters, mvpOnly: !filters.mvpOnly })}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors",
            filters.mvpOnly
              ? "bg-yellow-600 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Trophy className="h-3 w-3" />
          Con MVP
        </button>
      </div>
    </div>
  );
}

export function filterAndSortPokemons(
  pokemons: Pokemon[],
  filters: PokemonListFiltersState
): Pokemon[] {
  const q = filters.query.trim().toLowerCase();

  let list = pokemons.filter((p) => {
    if (filters.capture === "captured" && p.timesCaptured <= 0) return false;
    if (filters.capture === "uncaptured" && p.timesCaptured > 0) return false;
    if (filters.shinyOnly && p.shinyCapture !== "yes") return false;
    if (filters.showdownOnly && !(p.showdownWins && p.showdownWins > 0))
      return false;
    if (filters.mvpOnly && !(p.mvpCount && p.mvpCount > 0)) return false;
    if (
      filters.type !== "all" &&
      p.type1 !== filters.type &&
      p.type2 !== filters.type
    ) {
      return false;
    }
    if (q) {
      const hay = `${p.name} ${p.form || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  list = [...list].sort((a, b) => {
    switch (filters.sort) {
      case "captures":
        return b.timesCaptured - a.timesCaptured || a.name.localeCompare(b.name);
      case "showdowns":
        return (
          (b.showdownWins ?? 0) - (a.showdownWins ?? 0) ||
          a.name.localeCompare(b.name)
        );
      case "mvp":
        return (
          (b.mvpCount ?? 0) - (a.mvpCount ?? 0) || a.name.localeCompare(b.name)
        );
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return list;
}

export function useAvailableTypes(pokemons: Pokemon[]): string[] {
  return useMemo(() => {
    const set = new Set<string>();
    for (const p of pokemons) {
      if (p.type1) set.add(p.type1);
      if (p.type2) set.add(p.type2);
    }
    return Array.from(set).sort();
  }, [pokemons]);
}
