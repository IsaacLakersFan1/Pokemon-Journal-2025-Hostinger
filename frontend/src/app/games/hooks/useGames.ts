import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { UseGamesReturn } from "../interfaces/useGames";
import { Game } from "../interfaces/Game";

export function useGames(): UseGamesReturn {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/games`, {
        withCredentials: true,
      });
      setGames(response.data.games || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al cargar los juegos";
      setError(errorMessage);
      showToastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (gameId: number) => {
    try {
      await axios.delete(`${API_URL}/api/games/${gameId}`, {
        withCredentials: true,
      });
      setGames(prevGames => prevGames.filter(game => game.id !== gameId));
      showToastSuccess("Juego eliminado exitosamente");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al eliminar el juego";
      showToastError(errorMessage);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return {
    games,
    loading,
    error,
    fetchGames,
    deleteGame,
  };
}
