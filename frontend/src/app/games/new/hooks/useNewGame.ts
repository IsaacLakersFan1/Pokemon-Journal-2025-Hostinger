import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { toastSuccess } from "@/hooks/useToastSuccess";
import { UseNewGameReturn } from "../interfaces/useNewGame";
import { Player, Pokemon } from "../interfaces/NewGame";

export function useNewGame(): UseNewGameReturn {
  const [gameName, setGameName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [pokemonId, setPokemonId] = useState<number | null>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pokemonSearch, setPokemonSearch] = useState("");
  const [selectedPokemonName, setSelectedPokemonName] = useState<string | null>(null);

  const navigate = useNavigate();
  const { showToastError } = toastError();
  const { showToastSuccess } = toastSuccess();

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/players`, {
        withCredentials: true,
      });
      setPlayers(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al cargar los entrenadores";
      showToastError(errorMessage);
    }
  };

  const fetchPokemons = async (search: string) => {
    if (search.length < 3) {
      setPokemons([]);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/pokemon/search?searchTerm=${search}`, {
        withCredentials: true,
      });
      setPokemons(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al buscar Pokemon";
      showToastError(errorMessage);
    }
  };

  const handleAddPlayer = async () => {
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
      fetchPlayers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al agregar entrenador";
      showToastError(errorMessage);
    }
  };

  const handleCreateGame = async () => {
    if (!gameName.trim()) {
      showToastError("El nombre del juego no puede estar vacío");
      return;
    }

    if (selectedPlayers.length === 0) {
      showToastError("Por favor selecciona al menos un entrenador");
      return;
    }

    setIsLoading(true);

    try {
      const gameResponse = await axios.post(
        `${API_URL}/api/games`,
        {
          name: gameName,
          playerCount: selectedPlayers.length,
        },
        { withCredentials: true }
      );

      const gameId = gameResponse.data.game.id;

      const playerGamePromises = selectedPlayers.map((playerId) =>
        axios.post(
          `${API_URL}/api/player-games`,
          { playerId, gameId },
          { withCredentials: true }
        )
      );

      await Promise.all(playerGamePromises);

      showToastSuccess("Juego creado exitosamente");
      navigate("/games");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear el juego";
      showToastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayerSelection = (playerId: number) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  const selectPokemon = (id: number, name: string) => {
    setPokemonId(id);
    setSelectedPokemonName(name);
    setPokemonSearch("");
    setPokemons([]);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  return {
    gameName,
    setGameName,
    players,
    selectedPlayers,
    setSelectedPlayers,
    newPlayerName,
    setNewPlayerName,
    pokemonId,
    setPokemonId,
    pokemons,
    setPokemons,
    isLoading,
    pokemonSearch,
    setPokemonSearch,
    selectedPokemonName,
    setSelectedPokemonName,
    fetchPlayers,
    fetchPokemons,
    handleAddPlayer,
    handleCreateGame,
    togglePlayerSelection,
    selectPokemon,
  };
}
