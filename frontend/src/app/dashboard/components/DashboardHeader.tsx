import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Pencil,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface DashboardHeaderProps {
  gameId: string;
  gameName: string;
  pokemonGame?: string | null;
  notes?: string | null;
  playerCount: number;
}

export function DashboardHeader({
  gameId,
  gameName,
  pokemonGame,
  notes,
  playerCount,
}: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1 text-muted-foreground"
            onClick={() => navigate("/games")}
          >
            <ArrowLeft className="h-4 w-4" />
            Runs
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {gameName || "Dashboard"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {pokemonGame && <Badge variant="secondary">{pokemonGame}</Badge>}
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {playerCount} entrenador{playerCount === 1 ? "" : "es"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/games/${gameId}/players`)}
          >
            <Users className="mr-2 h-4 w-4" />
            Entrenadores
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/games/${gameId}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar run
          </Button>
        </div>
      </div>

      {notes && (
        <div className="rounded-lg border bg-muted/30">
          <button
            type="button"
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
            onClick={() => setNotesOpen((v) => !v)}
          >
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Reglas / notas del run
            </span>
            {notesOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {notesOpen && (
            <p className="whitespace-pre-wrap border-t px-4 py-3 text-sm text-muted-foreground">
              {notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
