import { Badge } from "@/components/ui/badge";
import { TypeCounts } from "../interfaces/PlayerStats";

interface TypeEncounterSectionProps {
  typeCounts: TypeCounts;
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

export function TypeEncounterSection({ typeCounts }: TypeEncounterSectionProps) {
  const typeKeys = Object.keys(typeCounts);

  if (typeKeys.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Encuentros por Tipo</h2>
        <div className="text-center text-gray-500">
          No hay datos de encuentros disponibles.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Encuentros por Tipo</h2>
      <div className="flex flex-wrap gap-3">
        {typeKeys.map((type) => (
          <Badge
            key={type}
            className="text-white font-semibold px-4 py-2 text-lg"
            style={{ backgroundColor: getTypeColor(type) }}
          >
            {type} {typeCounts[type]}
          </Badge>
        ))}
      </div>
    </div>
  );
}
