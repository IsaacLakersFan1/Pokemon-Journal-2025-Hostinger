import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GamesHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tus runs</h1>
        <p className="text-muted-foreground">
          Agenda de Nuzlockes con tus amigos
        </p>
      </div>
      <Button
        onClick={() => navigate("/games/new")}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Nuevo run
      </Button>
    </div>
  );
}
