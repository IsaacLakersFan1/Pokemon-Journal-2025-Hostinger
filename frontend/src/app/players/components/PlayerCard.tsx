import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Player } from "../interfaces/Players";
import { pokemonImageUrl, playerAvatarUrl } from "@/utils/pokemonImage";

interface PlayerCardProps {
  player: Player;
  gameId: string;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const navigate = useNavigate();

  const handleSelectPlayer = () => {
    // Shared trainer profile (name-merge stats live here)
    navigate(`/players/${player.id}`);
  };

  return (
    <Card className="border-2 transition-all duration-300 hover:border-blue-300 hover:shadow-xl">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={playerAvatarUrl()}
              alt={`${player.name} avatar`}
              className="h-32 w-16 object-contain"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>

          <h3 className="text-center text-xl font-semibold">{player.name}</h3>

          {player.pokemon ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={pokemonImageUrl(player.pokemon.image)}
                alt={player.pokemon.name}
                className="h-24 w-24 object-contain"
              />
              <span className="text-sm font-medium text-muted-foreground">
                {player.pokemon.name}
              </span>
            </div>
          ) : (
            <p className="text-center text-sm italic text-muted-foreground">
              Sin Pokémon favorito
            </p>
          )}

          <Button onClick={handleSelectPlayer} className="mt-4 w-full">
            Ver stats del entrenador
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
