import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { UseGlobalPlayersReturn } from "../interfaces/useGlobalPlayers";
import { GlobalPlayer, GlobalPlayerGameResponse } from "../interfaces/GlobalPlayers";

export function useGlobalPlayers(): UseGlobalPlayersReturn {
  const [players, setPlayers] = useState<GlobalPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showToastError } = toastError();

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/players`, {
        withCredentials: true,
      });

      // El API devuelve un array directo de jugadores
      const playersData = response.data;
      const formattedPlayers = playersData.map((player: any) => ({
        id: player.id,
        name: player.name,
        pokemon: player.pokemon
          ? {
              name: player.pokemon.name,
              image: `http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages/${player.pokemon.image}.png`
            }
          : null,
      }));

      setPlayers(formattedPlayers);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching global players:', err);
      const errorMessage = err.response?.data?.message || "Error al cargar entrenadores";
      setError(errorMessage);
      showToastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return {
    players,
    loading,
    error,
    fetchPlayers,
  };
}
