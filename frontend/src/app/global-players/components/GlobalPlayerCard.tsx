import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GlobalPlayer } from "../interfaces/GlobalPlayers";

interface GlobalPlayerCardProps {
  player: GlobalPlayer;
}

export function GlobalPlayerCard({ player }: GlobalPlayerCardProps) {
  const navigate = useNavigate();

  const handleSelectPlayer = () => {
    navigate(`/players/${player.id}`);
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Player Avatar */}
          <div className="relative">
            <img
              src="http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/player.png"
              alt={`${player.name} avatar`}
              className="w-16 h-32 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://github.com/shadcn.png';
              }}
            />
          </div>

          {/* Player Name */}
          <h3 className="text-xl font-semibold text-gray-800 text-center">
            {player.name}
          </h3>

          {/* Pokémon Info */}
          {player.pokemon ? (
            <div className="flex flex-col items-center space-y-2">
              <img
                src={player.pokemon.image}
                alt={player.pokemon.name}
                className="w-24 h-24 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://github.com/shadcn.png';
                }}
              />
              <span className="text-sm text-gray-600 font-medium">
                {player.pokemon.name}
              </span>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-gray-500 italic">
                No Pokémon selected
              </p>
            </div>
          )}

          {/* Select Player Button */}
          <Button
            onClick={handleSelectPlayer}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Ver Estadísticas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
