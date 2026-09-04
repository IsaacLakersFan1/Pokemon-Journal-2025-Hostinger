import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { UseDashboardReturn } from "../interfaces/useDashboard";
import {
  Player,
  Event,
  Pokemon,
  CreateEventRequest,
  PlayerGameResponse,
  ShowdownMatchup,
} from "../interfaces/Dashboard";

export function useDashboard(): UseDashboardReturn {
  const { gameId: gameIdParam } = useParams<{ gameId: string }>();
  const gameId = Number(gameIdParam);

  const [pokemonQuery, setPokemonQuery] = useState("");
  const [pokemonResults, setPokemonResults] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [route, setRoute] = useState("");
  const [nickname, setNickname] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [status, setStatus] = useState("Catched");
  const [isShiny, setIsShiny] = useState(false);
  const [isChamp, setIsChamp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [gameName, setGameName] = useState("");
  const [pokemonGame, setPokemonGame] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [routeList, setRouteList] = useState<string | null>(null);
  const [matchups, setMatchups] = useState<ShowdownMatchup[]>([]);

  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/events/game/${gameId}`, {
        withCredentials: true,
      });
      setEvents(response.data.events || []);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al cargar eventos";
      showToastError(errorMessage);
    }
  };

  const fetchGame = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/games/${gameId}`, {
        withCredentials: true,
      });
      const game = response.data.game;
      setGameName(game?.name ?? "");
      setPokemonGame(game?.pokemonGame ?? null);
      setNotes(game?.notes ?? null);
      setRouteList(game?.routeList ?? null);
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al cargar el juego";
      showToastError(msg);
    }
  };

  const fetchShowdowns = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/showdowns/game/${gameId}`,
        { withCredentials: true }
      );
      setMatchups(response.data.matchups ?? []);
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al cargar showdowns";
      showToastError(msg);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/player-games/${gameId}`, {
        withCredentials: true,
      });
      const playerDetails = response.data.players.map(
        (playerGame: PlayerGameResponse) => playerGame.player
      );
      setPlayers(playerDetails);
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al cargar entrenadores";
      showToastError(errorMessage);
    }
  };

  const searchPokemon = async (query: string) => {
    if (query.length >= 3) {
      try {
        const response = await axios.get(
          `${API_URL}/api/pokemon/search?searchTerm=${query}`,
          { withCredentials: true }
        );
        setPokemonResults(response.data);
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : "Error al buscar Pokemon";
        showToastError(errorMessage);
      }
    } else {
      setPokemonResults([]);
    }
  };

  const handleCreateEvent = async () => {
    if (!selectedPokemon || !route || !selectedPlayerId) {
      showToastError("Completa Pokémon, ruta y entrenador");
      return;
    }

    const finalNickname = nickname.trim() || selectedPokemon.name;

    setIsSubmitting(true);
    try {
      const eventData: CreateEventRequest = {
        pokemonId: selectedPokemon.id,
        pokemonImage: selectedPokemon.image || "",
        route,
        nickname: finalNickname,
        playerId: selectedPlayerId,
        status,
        gameId,
        isShiny: isShiny ? 1 : 0,
        isChamp: isChamp ? 1 : 0,
      };

      await axios.post(`${API_URL}/api/events`, eventData, {
        withCredentials: true,
      });

      showToastSuccess("Evento creado exitosamente");

      setSelectedPokemon(null);
      setPokemonQuery("");
      setRoute("");
      setNickname("");
      setSelectedPlayerId(null);
      setStatus("Catched");
      setIsShiny(false);
      setIsChamp(false);

      await fetchEvents();
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Error al crear evento";
      showToastError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (gameId) {
      fetchGame();
      fetchPlayers();
      fetchEvents();
      fetchShowdowns();
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
    isShiny,
    setIsShiny,
    isChamp,
    setIsChamp,
    isSubmitting,
    setIsSubmitting,
    events,
    setEvents,
    gameName,
    pokemonGame,
    notes,
    routeList,
    setRouteList,
    matchups,
    fetchEvents,
    fetchPlayers,
    fetchGame,
    fetchShowdowns,
    handleCreateEvent,
    searchPokemon,
  };
}
