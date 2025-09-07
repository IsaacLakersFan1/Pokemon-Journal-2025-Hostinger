import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PokedexErrorScreenProps {
  error: string;
}

export function PokedexErrorScreen({ error }: PokedexErrorScreenProps) {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error: {error}
        </AlertDescription>
      </Alert>
    </div>
  );
}
