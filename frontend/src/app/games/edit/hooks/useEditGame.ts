import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { UseEditGameReturn, GameWithPlayers } from "../interfaces/useEditGame";
import { Player, Pokemon } from "../../new/interfaces/NewGame";

export function useEditGame(): UseEditGameReturn {
  const { gameId: gameIdParam } = useParams<{ gameId: string }>();
  const gameId = gameIdParam ? parseInt(gameIdParam, 10) : null;
  const navigate = useNavigate();
  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const [game, setGame] = useState<GameWithPlayers | null>(null);
  const [gameName, setGameName] = useState("");
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);

  const fetchGame = async () => {
    if (!gameId || isNaN(gameId)) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/games/${gameId}`, {
        withCredentials: true,
      });
      const gameData = response.data.game as GameWithPlayers;
      setGame(gameData);
      setGameName(gameData.name);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al cargar el juego";
      showToastError(message);
      navigate("/games");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players?scope=account`, {
        withCredentials: true,
      });
      setAllPlayers(response.data ?? []);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al cargar los entrenadores";
      showToastError(message);
    }
  };

  const fetchPokemons = async (search: string) => {
    if (search.length < 3) {
      setPokemons([]);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/api/pokemon/search?searchTerm=${search}`,
        { withCredentials: true }
      );
      setPokemons(response.data ?? []);
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al buscar Pokemon";
      showToastError(message);
    }
  };

  const selectPokemon = (id: number, name: string) => {
    setPokemonId(id);
    setSelectedPokemonName(name);
    setPokemonSearch("");
    setPokemons([]);
  };

  const handleCreatePlayer = async () => {
    if (!newPlayerName.trim() || !pokemonId) {
      showToastError("Por favor proporciona todos los datos requeridos del entrenador");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/api/players`,
        { name: newPlayerName, pokemonId },
        { withCredentials: true }
      );
      setNewPlayerName("");
      setPokemonId(null);
      setSelectedPokemonName(null);
      showToastSuccess("Entrenador agregado exitosamente");
      await fetchAllPlayers();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al agregar entrenador";
      showToastError(message);
    }
  };

  const addPlayerToGame = async (playerId: number) => {
    if (!gameId) return;
    try {
      await axios.post(
        `${API_URL}/api/player-games`,
        { playerId, gameId },
        { withCredentials: true }
      );
      showToastSuccess("Entrenador agregado a la partida");
      await fetchGame();
      await fetchAllPlayers();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al agregar entrenador";
      showToastError(message);
    }
  };

  const removePlayerFromGame = async (playerId: number) => {
    if (!gameId) return;
    try {
      await axios.delete(
        `${API_URL}/api/player-games/${playerId}/${gameId}`,
        { withCredentials: true }
      );
      showToastSuccess("Entrenador quitado de la partida");
      await fetchGame();
      await fetchAllPlayers();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al quitar entrenador";
      showToastError(message);
    }
  };

  const updateGameName = async () => {
    if (!gameId || !game) return;
    try {
      await axios.put(
        `${API_URL}/api/games/${gameId}`,
        { name: gameName, playerCount: game.playerGames.length },
        { withCredentials: true }
      );
      showToastSuccess("Nombre del juego actualizado");
      await fetchGame();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Error al actualizar el juego";
      showToastError(message);
    }
  };

  const playersInGame = useMemo(() => {
    if (!game) return [];
    return game.playerGames.map((pg) => pg.player);
  }, [game]);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  useEffect(() => {
    fetchAllPlayers();
  }, []);

  return {
    gameId,
    game,
    gameName,
    setGameName,
    playersInGame,
    allPlayers,
    loading,
    fetchGame,
    fetchAllPlayers,
    addPlayerToGame,
    removePlayerFromGame,
    updateGameName,
    newPlayerName,
    setNewPlayerName,
    pokemonSearch,
    setPokemonSearch,
    pokemons,
    selectedPokemonName,
    selectPokemon,
    fetchPokemons,
    handleCreatePlayer,
  };
}
