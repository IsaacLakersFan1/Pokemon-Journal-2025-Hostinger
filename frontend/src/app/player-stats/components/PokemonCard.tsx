import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Star } from "lucide-react";
import { Pokemon } from "../interfaces/PlayerStats";

interface PokemonCardProps {
  pokemon: Pokemon;
}

// Helper function to get the background color for each Pokémon type
const getTypeColor = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    Bug: "#A8B820",
    Dark: "#705848",
    Dragon: "#6F35FC",
    Electric: "#F8D030",
    Fairy: "#F7A5D4",
    Fighting: "#C03028",
    Fire: "#F08030",
    Flying: "#A890F0",
    Ghost: "#705898",
    Grass: "#78C850",
    Ground: "#E0C068",
    Ice: "#98D8D8",
    Normal: "#A8A878",
    Poison: "#A040A0",
    Psychic: "#F85888",
    Rock: "#B8A038",
    Steel: "#B8B8D0",
    Water: "#6890F0",
  };

  return typeColors[type] || "#808080"; // Default to gray if no color found
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  // Decide which image to display (regular or shiny)
  const pokemonImage = pokemon.shinyCapture === 'yes' && pokemon.shinyImage ? pokemon.shinyImage : pokemon.image;

  // Determine display name and form
  const displayName = pokemon.timesCaptured === 0 ? '???' : pokemon.name;
  const displayForm = pokemon.timesCaptured === 0 ? 'Unknown Form' : pokemon.form;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Pokémon ID Section */}
          <div className="text-center text-sm font-bold text-gray-500">
            National Dex #{pokemon.id}
          </div>

          {/* Pokémon Name and Form */}
          <div className="text-center">
            <h3 className="text-xl font-semibold">{displayName}</h3>
            <h4 className="text-sm text-gray-500">{displayForm}</h4>
          </div>

          {/* Pokémon Image Section */}
          <div className="relative flex flex-col items-center">
            {pokemon.timesCaptured === 0 ? (
              // Display "?" icon for uncaptured Pokémon
              <div className="w-32 h-32 flex items-center justify-center">
                <HelpCircle className="w-24 h-24 text-gray-400" />
              </div>
            ) : (
              // Display Pokémon image
              <img
                src={`http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${pokemonImage}.png`}
                alt={pokemon.name}
                className="w-32 h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://github.com/shadcn.png';
                }}
              />
            )}
          </div>

          {/* Type Badges Section */}
          {pokemon.timesCaptured > 0 && (
            <div className="flex justify-center gap-2">
              <Badge
                className="text-white font-semibold"
                style={{ backgroundColor: getTypeColor(pokemon.type1) }}
              >
                {pokemon.type1}
              </Badge>
              {pokemon.type2 && (
                <Badge
                  className="text-white font-semibold"
                  style={{ backgroundColor: getTypeColor(pokemon.type2) }}
                >
                  {pokemon.type2}
                </Badge>
              )}
            </div>
          )}

          {/* Capture Count and Shiny Status */}
          <div className="flex items-center justify-center space-x-6">
            {/* Capture Count Section */}
            <div className="flex items-center justify-center">
              <img
                src="http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/pokeball.png"
                alt="Pokéball"
                className="w-6 h-6 mr-2"
                onError={(e) => {
                  e.currentTarget.src = 'https://github.com/shadcn.png';
                }}
              />
              <span className="text-lg font-bold">{pokemon.timesCaptured}</span>
            </div>

            {/* Shiny Status Section */}
            <div className="flex justify-center">
              <Star
                className={`w-6 h-6 ${
                  pokemon.shinyCapture === 'yes' ? 'text-yellow-500 fill-current' : 'text-gray-400'
                }`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
