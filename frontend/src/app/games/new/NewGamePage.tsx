import { useNewGame } from "./hooks/useNewGame";
import { GameNameForm } from "./components/GameNameForm";
import { PlayersList } from "./components/PlayersList";
import { NewPlayerForm } from "./components/NewPlayerForm";
import { CreateGameButton } from "./components/CreateGameButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Plus } from "lucide-react";

export function NewGamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    gameName,
    setGameName,
    pokemonGame,
    setPokemonGame,
    notes,
    setNotes,
    players,
    selectedPlayers,
    newPlayerName,
    setNewPlayerName,
    pokemonSearch,
    setPokemonSearch,
    pokemons,
    selectedPokemonName,
    isLoading,
    handleAddPlayer,
    handleCreateGame,
    togglePlayerSelection,
    selectPokemon,
    fetchPokemons,
  } = useNewGame();

  const isCreateDisabled = !gameName.trim() || selectedPlayers.length === 0;

  const handleAddPlayerAndClose = async () => {
    await handleAddPlayer();
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Nuzlocke</h1>
          <p className="mt-2 text-muted-foreground">
            Arma el run con tus amigos: juego, reglas y entrenadores
          </p>
        </div>

        <GameNameForm
          gameName={gameName}
          setGameName={setGameName}
          pokemonGame={pokemonGame}
          setPokemonGame={setPokemonGame}
          notes={notes}
          setNotes={setNotes}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Entrenadores</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Entrenador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Entrenador</DialogTitle>
              </DialogHeader>
              <NewPlayerForm
                newPlayerName={newPlayerName}
                setNewPlayerName={setNewPlayerName}
                pokemonSearch={pokemonSearch}
                setPokemonSearch={setPokemonSearch}
                pokemons={pokemons}
                selectedPokemonName={selectedPokemonName}
                onAddPlayer={handleAddPlayerAndClose}
                onSelectPokemon={selectPokemon}
                onFetchPokemons={fetchPokemons}
              />
            </DialogContent>
          </Dialog>
        </div>

        <PlayersList
          players={players}
          selectedPlayers={selectedPlayers}
          onTogglePlayer={togglePlayerSelection}
        />

        <CreateGameButton
          isLoading={isLoading}
          onCreateGame={handleCreateGame}
          disabled={isCreateDisabled}
        />
      </div>
    </div>
  );
}
