import { Pokemon, TypeEffectiveness } from "./Pokedex";

export interface UsePokedexReturn {
  pokemons: Pokemon[];
  filteredPokemons: Pokemon[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPokemon: Pokemon | null;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  typeEffectiveness: TypeEffectiveness;
  setTypeEffectiveness: (effectiveness: TypeEffectiveness) => void;
  modalState: {
    info: boolean;
    create: boolean;
    edit: boolean;
  };
  setModalState: (state: { info: boolean; create: boolean; edit: boolean }) => void;
  loading: boolean;
  error: string | null;
  fetchPokemons: () => Promise<void>;
  handleSearch: (term: string) => Promise<void>;
  openModal: (type: "info" | "create" | "edit", pokemon?: Pokemon) => Promise<void>;
  closeModal: (type: "info" | "create" | "edit") => void;
  handleCreatePokemon: (newPokemon: Pokemon) => void;
  handleUpdatePokemon: (updatedPokemon: Pokemon) => void;
}
