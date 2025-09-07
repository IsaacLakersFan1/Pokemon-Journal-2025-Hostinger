import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { UsePlayerStatsReturn } from "../interfaces/usePlayerStats";
import { PlayerStats, Pokemon } from "../interfaces/PlayerStats";

export function usePlayerStats(): UsePlayerStatsReturn {
  const { playerId } = useParams<{ playerId: string }>();
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showToastError } = toastError();

  const fetchStats = async () => {
    if (!playerId) {
      setError("Player ID not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/players/stats/${playerId}`, {
        withCredentials: true,
      });
      setStats(response.data);
    } catch (err: any) {
      console.error("Error fetching player stats", err);
      const errorMessage = err.response?.data?.message || "Error al cargar estadísticas del jugador";
      setError(errorMessage);
      showToastError(errorMessage);
    }
  };

  const fetchPokemons = async () => {
    if (!playerId) {
      setError("Player ID not found");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/players/stats/pokemon/${playerId}`, {
        withCredentials: true,
      });
      setPokemons(response.data);
    } catch (err: any) {
      console.error("Error fetching Pokémon data", err);
      const errorMessage = err.response?.data?.message || "Error al cargar datos de Pokemon";
      setError(errorMessage);
      showToastError(errorMessage);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([fetchStats(), fetchPokemons()]);
    } catch (err) {
      // Error handling is done in individual functions
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [playerId]);

  return {
    stats,
    pokemons,
    loading,
    error,
    fetchStats,
    fetchPokemons,
  };
}
