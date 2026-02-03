import { Player, Pokemon } from "../../new/interfaces/NewGame";

export interface GameWithPlayers {
  id: number;
  name: string;
  playerCount: number;
  playerGames: Array<{
    id: number;
    playerId: number;
    gameId: number;
    player: Player;
  }>;
}

export interface UseEditGameReturn {
  gameId: number | null;
  game: GameWithPlayers | null;
  gameName: string;
  setGameName: (name: string) => void;
  playersInGame: Player[];
  allPlayers: Player[];
  loading: boolean;
  fetchGame: () => Promise<void>;
  fetchAllPlayers: () => Promise<void>;
  addPlayerToGame: (playerId: number) => Promise<void>;
  removePlayerFromGame: (playerId: number) => Promise<void>;
  updateGameName: () => Promise<void>;
  newPlayerName: string;
  setNewPlayerName: (name: string) => void;
  pokemonSearch: string;
  setPokemonSearch: (search: string) => void;
  pokemons: Pokemon[];
  selectedPokemonName: string | null;
  selectPokemon: (id: number, name: string) => void;
  fetchPokemons: (search: string) => Promise<void>;
  handleCreatePlayer: () => Promise<void>;
}
