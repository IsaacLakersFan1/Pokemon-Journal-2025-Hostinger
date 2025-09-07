import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateGameButtonProps {
  isLoading: boolean;
  onCreateGame: () => void;
  disabled?: boolean;
}

export function CreateGameButton({ isLoading, onCreateGame, disabled }: CreateGameButtonProps) {
  return (
    <div className="flex justify-center">
      <Button
        onClick={onCreateGame}
        disabled={isLoading || disabled}
        size="lg"
        className="min-w-[200px]"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando Juego...
          </>
        ) : (
          "Crear Juego"
        )}
      </Button>
    </div>
  );
}
