import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, ArrowRight, Skull, Star, Crown, Info, Trash2 } from "lucide-react";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { Event } from "../interfaces/Dashboard";
import { InformationPokedexCard } from "./InformationPokedexCard";
import API_URL from "@/utils/apiConfig";
import axios from "axios";

interface EventCardProps {
  event: Event;
  onDelete: () => void;
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
  return typeColors[type] || "#808080";
};

export function EventCard({ event, onDelete }: EventCardProps) {
  const [currentStatus, setCurrentStatus] = useState(event.status);
  const [shiny, setShiny] = useState(event.isShiny);
  const [champ, setChamp] = useState(event.isChamp);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [typeEffectiveness, setTypeEffectiveness] = useState<{ [key: string]: number }>({});

  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const statusColors: Record<string, string> = {
    Catched: "bg-green-100 border-green-400",
    "Run Away": "bg-gray-100 border-gray-400",
    Defeated: "bg-red-100 border-red-400",
  };

  const activeStatusColor = "bg-blue-300 border-blue-500";

  const handleStatusChange = async (newStatus: string) => {
    try {
      await axios.put(
        `${API_URL}/api/events/${event.id}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setCurrentStatus(newStatus);
      showToastSuccess(`Estado actualizado a "${newStatus}" exitosamente.`);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al actualizar estado";
      showToastError(errorMessage);
    }
  };

  const toggleAttribute = async (attribute: 'isShiny' | 'isChamp', value: number) => {
    try {
      await axios.put(
        `${API_URL}/api/events/${event.id}/attributes`,
        {
          [attribute]: value,
          isShiny: attribute === 'isShiny' ? value : shiny,
          isChamp: attribute === 'isChamp' ? value : champ,
        },
        { withCredentials: true }
      );
      if (attribute === 'isShiny') {
        setShiny(value);
        showToastSuccess(value ? 'Marcado como Shiny!' : 'Desmarcado como Shiny.');
      } else {
        setChamp(value);
        showToastSuccess(value ? 'Marcado como Campeón!' : 'Desmarcado como Campeón.');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Error al actualizar ${attribute}`;
      showToastError(errorMessage);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${API_URL}/api/events/${event.id}`, {
        withCredentials: true,
      });
      showToastSuccess("Evento eliminado exitosamente.");
      onDelete();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al eliminar evento";
      showToastError(errorMessage);
    }
  };

  const fetchPokemonInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pokemon/${event.pokemonId}`, {
        withCredentials: true,
      });
      const { pokemon, typeEffectiveness } = response.data;
      setSelectedPokemon(pokemon);
      setTypeEffectiveness(typeEffectiveness);
      setIsInfoModalOpen(true);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al cargar información del Pokemon";
      showToastError(errorMessage);
    }
  };

  return (
    <>
      <div
        className={`border rounded-md p-4 shadow-md flex w-full justify-between items-center ${
          statusColors[currentStatus] || 'bg-white'
        }`}
      >
        {/* First Block - Pokemon Image and Types */}
        <div>
          <img
            src={`http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${event.pokemon.image}.png`}
            alt={event.pokemon.name}
            className="w-20 h-20 mx-auto object-contain mb-2"
          />
          <div className="flex justify-center space-x-2 mt-2">
            <span
              className="px-2 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: getTypeColor(event.pokemon.type1) }}
            >
              {event.pokemon.type1}
            </span>
            {event.pokemon.type2 && (
              <span
                className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                style={{ backgroundColor: getTypeColor(event.pokemon.type2) }}
              >
                {event.pokemon.type2}
              </span>
            )}
          </div>
        </div>

        {/* Second Block - Pokemon Name and Nickname */}
        <div>
          {event.nickname && <p className="text-center text-sm font-bold italic">"{event.nickname}"</p>}
          <h3 className="text-md text-center">{event.pokemon.name}</h3>
          {event.pokemon.form && <p className="text-center text-xs text-gray-500">{event.pokemon.form}</p>}
        </div>

        {/* Third Block - Route */}
        <div>
          <h3 className="text-md font-bold text-center">{event.route}</h3>
        </div>

        {/* Fourth Block - Status Buttons */}
        <div>
          <div className="flex flex-col justify-between">
            <Button
              variant={currentStatus === 'Catched' ? 'default' : 'outline'}
              size="sm"
              className={`px-8 py-2 mb-2 ${
                currentStatus === 'Catched' ? activeStatusColor : 'bg-white'
              }`}
              onClick={() => handleStatusChange('Catched')}
            >
              <Check className="text-green-600 h-4 w-4" />
            </Button>
            <Button
              variant={currentStatus === 'Run Away' ? 'default' : 'outline'}
              size="sm"
              className={`px-8 py-2 mb-2 ${
                currentStatus === 'Run Away' ? activeStatusColor : 'bg-white'
              }`}
              onClick={() => handleStatusChange('Run Away')}
            >
              <ArrowRight className="text-gray-600 h-4 w-4" />
            </Button>
            <Button
              variant={currentStatus === 'Defeated' ? 'default' : 'outline'}
              size="sm"
              className={`px-8 py-2 ${
                currentStatus === 'Defeated' ? activeStatusColor : 'bg-white'
              }`}
              onClick={() => handleStatusChange('Defeated')}
            >
              <Skull className="text-red-600 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Fifth Block - Shiny, Champion, Info, Delete */}
        <div>
          <div className="flex flex-col h-28 justify-between items-center">
            <Button
              variant={shiny ? 'default' : 'outline'}
              size="sm"
              className={`py-2 px-6 ${shiny ? 'bg-yellow-300' : 'bg-gray-200'}`}
              onClick={() => toggleAttribute('isShiny', shiny ? 0 : 1)}
            >
              <Star className={shiny ? 'text-yellow-600' : 'text-gray-600 h-4 w-4'} />
            </Button>
            <Button
              variant={champ ? 'default' : 'outline'}
              size="sm"
              className={`py-2 px-6 ${champ ? 'bg-yellow-300' : 'bg-gray-200'}`}
              onClick={() => toggleAttribute('isChamp', champ ? 0 : 1)}
            >
              <Crown className={champ ? 'text-yellow-600' : 'text-gray-600 h-4 w-4'} />
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="py-2 px-4 bg-blue-500 text-white hover:bg-blue-600"
                onClick={fetchPokemonInfo}
              >
                <Info className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="py-2 px-4 bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEvent} className="bg-red-500 hover:bg-red-600">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Information Modal */}
      {isInfoModalOpen && selectedPokemon && (
        <InformationPokedexCard
          pokemon={selectedPokemon}
          typeEffectiveness={typeEffectiveness}
          onClose={() => setIsInfoModalOpen(false)}
        />
      )}
    </>
  );
}
