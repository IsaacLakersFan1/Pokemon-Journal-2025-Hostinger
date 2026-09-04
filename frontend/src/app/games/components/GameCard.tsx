import { Game } from "../interfaces/Game";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Trash2, Play, Pencil, Users, Swords, BookOpen } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GameCardProps {
  game: Game;
  onDelete: (gameId: number) => void;
}

export function GameCard({ game, onDelete }: GameCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const trainerNames =
    game.playerGames?.map((pg) => pg.player.name).filter(Boolean) ?? [];

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-lg">{game.name}</CardTitle>
            {game.pokemonGame && (
              <p className="text-sm text-muted-foreground">{game.pokemonGame}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {formatDate(game.createdAt)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" />
            {trainerNames.length > 0
              ? trainerNames.join(", ")
              : `${game.playerCount} entrenador(es)`}
          </span>
          {typeof game._count?.events === "number" && (
            <span className="inline-flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {game._count.events} eventos
            </span>
          )}
          {typeof game._count?.showdowns === "number" &&
            game._count.showdowns > 0 && (
              <span className="inline-flex items-center gap-1">
                <Swords className="h-4 w-4" />
                {game._count.showdowns} showdowns
              </span>
            )}
        </div>

        {game.notes && (
          <p className="line-clamp-2 rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            {game.notes}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => navigate(`/games/${game.id}/dashboard`)}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            Continuar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate(`/games/${game.id}/players`)}
          >
            <Users className="h-4 w-4" />
            Entrenadores
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate(`/games/${game.id}/edit`)}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Archivar este run?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se ocultará &quot;{game.name}&quot; de tu lista (soft delete).
                  Los eventos y showdowns del run dejan de mostrarse, pero no se
                  borran de la base de datos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(game.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Archivar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
