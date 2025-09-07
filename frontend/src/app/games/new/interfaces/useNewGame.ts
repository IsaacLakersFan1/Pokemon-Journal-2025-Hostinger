import { Player, Pokemon } from "./NewGame";

export interface UseNewGameReturn {
  gameName: string;
  setGameName: (name: string) => void;
  players: Player[];
  selectedPlayers: number[];
  setSelectedPlayers: (players: number[]) => void;
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  pokemonId: number | null;
  setPokemonId: (id: number | null) => void;
  pokemons: Pokemon[];
  setPokemons: (pokemons: Pokemon[]) => void;
  isLoading: boolean;
  pokemonSearch: string;
  setPokemonSearch: (search: string) => void;
  selectedPokemonName: string | null;
  setSelectedPokemonName: (name: string | null) => void;
  fetchPlayers: () => Promise<void>;
  fetchPokemons: (search: string) => Promise<void>;
  handleAddPlayer: () => Promise<void>;
  handleCreateGame: () => Promise<void>;
  togglePlayerSelection: (playerId: number) => void;
  selectPokemon: (id: number, name: string) => void;
}
