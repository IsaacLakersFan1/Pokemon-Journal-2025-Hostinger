import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "@/utils/apiConfig";
import { toastError } from "@/hooks/useToastError";
import { UsePokedexReturn } from "../interfaces/usePokedex";
import { Pokemon, TypeEffectiveness } from "../interfaces/Pokedex";

export function usePokedex(): UsePokedexReturn {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [typeEffectiveness, setTypeEffectiveness] = useState<TypeEffectiveness>({});
  const [modalState, setModalState] = useState({
    info: false,
    create: false,
    edit: false,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { showToastError } = toastError();

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/pokemon`, {
        withCredentials: true,
      });
      setPokemons(response.data.pokemons || response.data);
      setFilteredPokemons(response.data.pokemons || response.data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching pokemons:", err);
      const errorMessage = err.response?.data?.message || "Error al cargar Pokemon";
      setError(errorMessage);
      showToastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      setFilteredPokemons(pokemons);
    } else {
      try {
        const response = await axios.get(
          `${API_URL}/api/pokemon/search?searchTerm=${term}`,
          {
            withCredentials: true,
          }
        );
        setFilteredPokemons(response.data);
      } catch (err: any) {
        console.error("Error during search:", err);
        const errorMessage = err.response?.data?.message || "Error en la búsqueda";
        showToastError(errorMessage);
      }
    }
  };

  const openModal = async (type: "info" | "create" | "edit", pokemon?: Pokemon) => {
    if (type === "info" && pokemon) {
      try {
        const response = await axios.get(`${API_URL}/api/pokemon/${pokemon.id}`, {
          withCredentials: true,
        });
        const { pokemon: fetchedPokemon, typeEffectiveness: effectiveness } = response.data;

        setSelectedPokemon({
          ...fetchedPokemon,
          form: fetchedPokemon.form || "", // Ensure form is always a string
        });
        setTypeEffectiveness(effectiveness);
      } catch (err: any) {
        console.error("Error fetching Pokémon details:", err);
        const errorMessage = err.response?.data?.message || "Error al cargar detalles del Pokemon";
        showToastError(errorMessage);
      }
    } else if (pokemon) {
      setSelectedPokemon(pokemon);
    }
    setModalState({ ...modalState, [type]: true });
  };

  const closeModal = (type: "info" | "create" | "edit") => {
    setSelectedPokemon(null);
    setTypeEffectiveness({});
    setModalState({ ...modalState, [type]: false });
  };

  const handleCreatePokemon = (newPokemon: Pokemon) => {
    setPokemons((prev) => [...prev, newPokemon]);
    setFilteredPokemons((prev) => [...prev, newPokemon]);
    closeModal("create");
  };

  const handleUpdatePokemon = (updatedPokemon: Pokemon) => {
    setPokemons((prev) =>
      prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p))
    );
    setFilteredPokemons((prev) =>
      prev.map((p) => (p.id === updatedPokemon.id ? updatedPokemon : p))
    );
    closeModal("edit");
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  return {
    pokemons,
    filteredPokemons,
    searchTerm,
    setSearchTerm,
    selectedPokemon,
    setSelectedPokemon,
    typeEffectiveness,
    setTypeEffectiveness,
    modalState,
    setModalState,
    loading,
    error,
    fetchPokemons,
    handleSearch,
    openModal,
    closeModal,
    handleCreatePokemon,
    handleUpdatePokemon,
  };
}
