import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Edit } from "lucide-react";
import { Pokemon } from "../interfaces/Pokedex";

interface PokedexCardProps {
  pokemon: Pokemon;
  onInfoClick: (pokemon: Pokemon) => void;
  onEditClick: (pokemon: Pokemon) => void;
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
  return typeColors[type] || "#A8A8A8"; // Default to gray if type is not found
};

export function PokedexCard({ pokemon, onInfoClick, onEditClick }: PokedexCardProps) {
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-300">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* National Dex Number */}
          <div className="text-center text-sm font-bold text-gray-500">
            National Dex #{pokemon.nationalDex}
          </div>

          {/* Pokemon Name and Form */}
          <div className="text-center">
            <h3 className="text-lg font-bold">{pokemon.name}</h3>
            {pokemon.form && (
              <h4 className="text-sm text-gray-500">{pokemon.form}</h4>
            )}
          </div>

          {/* Pokemon Image */}
          <div className="relative">
            <img
              src={`http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${pokemon.image}.png`}
              alt={pokemon.name}
              className="w-36 h-36 object-contain"
              onError={(e) => {
                e.currentTarget.src = 'https://github.com/shadcn.png';
              }}
            />
          </div>

          {/* Type Badges */}
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

          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => onInfoClick(pokemon)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Info className="h-4 w-4 mr-2" />
              Info
            </Button>
            <Button
              onClick={() => onEditClick(pokemon)}
              variant="outline"
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
