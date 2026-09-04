import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { UseGlobalPlayersReturn } from "../interfaces/useGlobalPlayers";
import { GlobalPlayer } from "../interfaces/GlobalPlayers";
import { pokemonImageUrl } from "@/utils/pokemonImage";

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

      const playersData = response.data;
      const formattedPlayers = playersData.map(
        (player: {
          id: number;
          name: string;
          pokemon?: { name: string; image?: string | null } | null;
        }) => ({
          id: player.id,
          name: player.name,
          pokemon: player.pokemon
            ? {
                name: player.pokemon.name,
                image: pokemonImageUrl(player.pokemon.image),
              }
            : null,
        })
      );

      setPlayers(formattedPlayers);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al cargar entrenadores";
      setError(errorMessage || "Error al cargar entrenadores");
      showToastError(errorMessage || "Error al cargar entrenadores");
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
