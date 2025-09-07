import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { UseDashboardReturn } from "../interfaces/useDashboard";
import { Player, Event, Pokemon, CreateEventRequest, PlayerGameResponse } from "../interfaces/Dashboard";

export function useDashboard(): UseDashboardReturn {
  const { gameId: gameIdParam } = useParams<{ gameId: string }>();
  const gameId = Number(gameIdParam);
  
  // State
  const [pokemonQuery, setPokemonQuery] = useState("");
  const [pokemonResults, setPokemonResults] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [route, setRoute] = useState("");
  const [nickname, setNickname] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [status, setStatus] = useState("Catched");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events/game/${gameId}`, {
        withCredentials: true,
      });
      setEvents(response.data.events || []);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al cargar eventos";
      showToastError(errorMessage);
    }
  };

  // Fetch players
  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/player-games/${gameId}`, {
        withCredentials: true,
      });
      console.log('Players response:', response.data);
      const playerDetails = response.data.players.map((playerGame: PlayerGameResponse) => playerGame.player);
      setPlayers(playerDetails);
    } catch (error: any) {
      console.error('Error fetching players:', error);
      const errorMessage = error.response?.data?.message || "Error al cargar entrenadores";
      showToastError(errorMessage);
    }
  };

  // Search Pokemon
  const searchPokemon = async (query: string) => {
    if (query.length >= 3) {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/search?searchTerm=${query}`, {
          withCredentials: true,
        });
        setPokemonResults(response.data);
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Error al buscar Pokemon";
        showToastError(errorMessage);
      }
    } else {
      setPokemonResults([]);
    }
  };

  // Create event
  const handleCreateEvent = async () => {
    if (!selectedPokemon || !route || !nickname || !selectedPlayerId) {
      showToastError("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData: CreateEventRequest = {
        pokemonId: selectedPokemon.id,
        pokemonImage: selectedPokemon.image || "",
        route,
        nickname,
        playerId: selectedPlayerId,
        status,
        gameId,
      };

      await axios.post(`${API_URL}/api/events`, eventData, {
        withCredentials: true,
      });

      showToastSuccess("Evento creado exitosamente");
      
      // Reset form
      setSelectedPokemon(null);
      setPokemonQuery("");
      setRoute("");
      setNickname("");
      setSelectedPlayerId(null);
      setStatus("Catched");
      
      // Refresh events
      await fetchEvents();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear evento";
      showToastError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Effects
  useEffect(() => {
    if (gameId) {
      fetchPlayers();
      fetchEvents();
    }
  }, [gameId]);

  useEffect(() => {
    if (pokemonQuery.length >= 3) {
      searchPokemon(pokemonQuery);
    } else {
      setPokemonResults([]);
    }
  }, [pokemonQuery]);

  return {
    // State
    pokemonQuery,
    setPokemonQuery,
    pokemonResults,
    setPokemonResults,
    selectedPokemon,
    setSelectedPokemon,
    route,
    setRoute,
    nickname,
    setNickname,
    players,
    setPlayers,
    selectedPlayerId,
    setSelectedPlayerId,
    status,
    setStatus,
    isSubmitting,
    setIsSubmitting,
    events,
    setEvents,
    
    // Functions
    fetchEvents,
    fetchPlayers,
    handleCreateEvent,
    searchPokemon,
  };
}
