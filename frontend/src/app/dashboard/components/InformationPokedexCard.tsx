import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Pokemon {
  id: number;
  nationalDex: number;
  name: string;
  form: string | null;
  type1: string;
  type2?: string | null;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  generation: number;
  image: string;
  shinyImage: string;
}

interface TypeEffectiveness {
  [key: string]: number;
}

interface InformationPokedexCardProps {
  pokemon: Pokemon;
  onClose: () => void;
  typeEffectiveness: TypeEffectiveness;
}

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
  return typeColors[type] || "#A8A8A8";
};

const getStatBarColor = (value: number): string => {
  if (value < 40) return "bg-red-600";
  if (value < 60) return "bg-orange-600";
  if (value < 90) return "bg-yellow-400";
  if (value < 120) return "bg-green-500";
  return "bg-green-600";
};

const renderStatBar = (label: string, value: number) => {
  const barWidth = Math.min(value, 100);

  return (
    <div className="flex items-center justify-center mt-4">
      <p className="w-1/2 text-md font-semibold">{label}:</p>
      <p className="w-1/6 text-lg text-right">{value}</p>
      <div className="w-full h-4 bg-gray-300 rounded-md overflow-hidden ml-2">
        <div
          className={`${getStatBarColor(value)} h-full`}
          style={{ width: `${barWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

const getEffectivenessColor = (effectiveness: number): string => {
  if (effectiveness === 0) return "bg-black text-white mb-4";
  if (effectiveness === 0.25) return "bg-red-900 text-white mb-4";
  if (effectiveness === 0.5) return "bg-red-600 text-white mb-4";
  if (effectiveness === 1) return "bg-gray-300 text-black mb-4";
  if (effectiveness === 2) return "bg-green-500 text-white mb-4";
  if (effectiveness === 4) return "bg-green-300 text-black mb-4";
  return "bg-gray-300 text-black mb-4";
};

const renderTypeEffectiveness = (typeEffectiveness: TypeEffectiveness) => {
  const abbreviateType = (type: string): string => {
    return type.slice(0, 3).toUpperCase();
  };

  const effectivenessGroups = Object.entries(typeEffectiveness).reduce(
    (acc: [string, number][][], [type, effectiveness], index) => {
      if (index % 4 === 0) acc.push([]);
      acc[acc.length - 1].push([type, effectiveness]);
      return acc;
    },
    []
  );

  return (
    <div>
      <h3 className="text-lg font-bold mb-2 text-center">Defensas de Tipo</h3>
      <div className="space-y-2">
        {effectivenessGroups.map((group, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2">
            {group.map(([type, effectiveness]) => (
              <div key={type} className="text-center">
                <div
                  className="px-2 py-1 rounded-md font-bold text-xs"
                  style={{
                    backgroundColor: getTypeColor(type),
                    color: "#fff",
                  }}
                >
                  {abbreviateType(type)}
                </div>
                <div
                  className={`px-2 py-1 mt-1 rounded-md text-sm ${getEffectivenessColor(
                    effectiveness
                  )}`}
                >
                  {effectiveness === 0.25 ? "1/4" : effectiveness === 0.5 ? "1/2" : effectiveness}x
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export function InformationPokedexCard({
  pokemon,
  onClose,
  typeEffectiveness,
}: InformationPokedexCardProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[50vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {pokemon.name}
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            #{pokemon.nationalDex.toString().padStart(3, '0')} • Generación {pokemon.generation}
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pokemon Image and Types */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-xl opacity-20"></div>
              <img
                src={`http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${pokemon.image}.png`}
                alt={pokemon.name}
                className="relative w-64 h-64 mx-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://github.com/shadcn.png';
                }}
              />
            </div>
            <div className="flex justify-center gap-3">
              <span
                className="text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg"
                style={{ backgroundColor: getTypeColor(pokemon.type1) }}
              >
                {pokemon.type1}
              </span>
              {pokemon.type2 && (
                <span
                  className="text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg"
                  style={{ backgroundColor: getTypeColor(pokemon.type2) }}
                >
                  {pokemon.type2}
                </span>
              )}
            </div>
            {pokemon.form && (
              <div className="text-center">
                <span className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                  Forma: {pokemon.form}
                </span>
              </div>
            )}
          </div>

          {/* Base Stats */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Estadísticas Base
            </h3>
            <div className="space-y-4">
              {renderStatBar("HP", pokemon.hp)}
              {renderStatBar("Ataque", pokemon.attack)}
              {renderStatBar("Defensa", pokemon.defense)}
              {renderStatBar("Ataque Especial", pokemon.specialAttack)}
              {renderStatBar("Defensa Especial", pokemon.specialDefense)}
              {renderStatBar("Velocidad", pokemon.speed)}
              <div className="border-t pt-4">
                {renderStatBar("Total", pokemon.total)}
              </div>
            </div>
          </div>

          {/* Type Effectiveness */}
          <div className="space-y-4">
            {renderTypeEffectiveness(typeEffectiveness)}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button onClick={onClose} variant="outline" size="lg" className="px-8">
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
