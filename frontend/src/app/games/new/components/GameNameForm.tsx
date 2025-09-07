import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GameNameFormProps {
  gameName: string;
  setGameName: (name: string) => void;
}

export function GameNameForm({ gameName, setGameName }: GameNameFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Juego</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="gameName">Nombre del Juego</Label>
          <Input
            id="gameName"
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Ingresa el nombre del juego"
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
