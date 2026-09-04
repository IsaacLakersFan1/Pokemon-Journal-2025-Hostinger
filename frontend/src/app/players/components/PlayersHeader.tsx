import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function PlayersHeader() {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <div className="mb-8 space-y-2">
      {gameId && (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1 text-muted-foreground"
          onClick={() => navigate(`/games/${gameId}/dashboard`)}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al run
        </Button>
      )}
      <h1 className="text-3xl font-bold tracking-tight">Entrenadores del run</h1>
      <p className="text-muted-foreground">
        Entra a un perfil para ver stats compartidas (mismo nombre = mismo
        entrenador entre cuentas)
      </p>
    </div>
  );
}
