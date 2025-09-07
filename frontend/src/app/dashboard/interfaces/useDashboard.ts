import { Player, Event, Pokemon, CreateEventRequest } from "./Dashboard";

export interface UseDashboardReturn {
  // State
  pokemonQuery: string;
  setPokemonQuery: (query: string) => void;
  pokemonResults: Pokemon[];
  setPokemonResults: (results: Pokemon[]) => void;
  selectedPokemon: Pokemon | null;
  setSelectedPokemon: (pokemon: Pokemon | null) => void;
  route: string;
  setRoute: (route: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  selectedPlayerId: number | null;
  setSelectedPlayerId: (id: number | null) => void;
  status: string;
  setStatus: (status: string) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
  
  // Functions
  fetchEvents: () => Promise<void>;
  fetchPlayers: () => Promise<void>;
  handleCreateEvent: () => Promise<void>;
  searchPokemon: (query: string) => Promise<void>;
}
