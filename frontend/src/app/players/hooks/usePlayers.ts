import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { UsePlayersReturn } from "../interfaces/usePlayers";
import { Player, PlayerGameResponse } from "../interfaces/Players";
import { pokemonImageUrl } from "@/utils/pokemonImage";

export function usePlayers(): UsePlayersReturn {
  const { gameId } = useParams<{ gameId: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showToastError } = toastError();

  const fetchPlayers = async () => {
    if (!gameId) {
      setError("Game ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/player-games/${gameId}`, {
        withCredentials: true,
      });

      const playersData = response.data.players;
      const formattedPlayers = playersData.map((p: PlayerGameResponse) => ({
        id: p.player.id,
        name: p.player.name,
        pokemon: p.player.pokemon
          ? {
              name: p.player.pokemon.name,
              image: pokemonImageUrl(p.player.pokemon.image),
            }
          : null,
      }));

      setPlayers(formattedPlayers);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : "Error al cargar entrenadores";
      setError(errorMessage || "Error al cargar entrenadores");
      showToastError(errorMessage || "Error al cargar entrenadores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [gameId]);

  return {
    players,
    loading,
    error,
    fetchPlayers,
  };
}
