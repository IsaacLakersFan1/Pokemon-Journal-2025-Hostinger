import { Player } from "../interfaces/NewGame";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface PlayersListProps {
  players: Player[];
  selectedPlayers: number[];
  onTogglePlayer: (playerId: number) => void;
}

export function PlayersList({ players, selectedPlayers, onTogglePlayer }: PlayersListProps) {
  if (players.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entrenadores Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No hay entrenadores disponibles. Crea uno nuevo abajo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrenadores Disponibles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => {
            const isSelected = selectedPlayers.includes(player.id);
            return (
              <div
                key={player.id}
                className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                  isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium">{player.name}</p>
                    {player.pokemon && (
                      <p className="text-sm text-muted-foreground">
                        Pokemon: {player.pokemon.name}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant={isSelected ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onTogglePlayer(player.id)}
                  className="flex items-center gap-2"
                >
                  {isSelected ? (
                    <>
                      <X className="h-4 w-4" />
                      Quitar
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Agregar
                    </>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
        {selectedPlayers.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedPlayers.length} entrenador{selectedPlayers.length !== 1 ? "es" : ""} seleccionado{selectedPlayers.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
