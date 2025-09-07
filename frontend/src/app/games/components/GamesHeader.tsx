import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GamesHeader() {
  const navigate = useNavigate();

  const handleCreateGame = () => {
    navigate("/games/new");
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tus Juegos</h1>
        <p className="text-muted-foreground">
          Gestiona tus sesiones de Pokemon Go
        </p>
      </div>
      <Button onClick={handleCreateGame} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Crear Nuevo Juego
      </Button>
    </div>
  );
}
