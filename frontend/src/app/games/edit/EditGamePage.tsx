import { useState } from "react";
import { useEditGame } from "./hooks/useEditGame";
import { GameNameForm } from "../new/components/GameNameForm";
import { PlayersList } from "../new/components/PlayersList";
import { NewPlayerForm } from "../new/components/NewPlayerForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function EditGamePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    game,
    gameName,
    setGameName,
    playersInGame,
    allPlayers,
    loading,
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
  } = useEditGame();

  const playersInGameIds = playersInGame.map((p) => p.id);

  const handleTogglePlayer = (playerId: number) => {
    if (playersInGameIds.includes(playerId)) {
      removePlayerFromGame(playerId);
      return;
    }
    addPlayerToGame(playerId);
  };

  const handleCreatePlayerAndClose = async () => {
    await handleCreatePlayer();
    setIsModalOpen(false);
  };

  if (loading || !game) {
    return <LoadingScreen message="Cargando juego..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Editar Juego</h1>
          <p className="text-muted-foreground mt-2">
            Modifica los entrenadores de esta partida
          </p>
        </div>

        <GameNameForm gameName={gameName} setGameName={setGameName} />
        <div className="flex justify-end">
          <Button onClick={updateGameName} variant="secondary">
            Guardar nombre
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Entrenadores</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
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
                onAddPlayer={handleCreatePlayerAndClose}
                onSelectPokemon={selectPokemon}
                onFetchPokemons={fetchPokemons}
              />
            </DialogContent>
          </Dialog>
        </div>

        <PlayersList
          players={allPlayers}
          selectedPlayers={playersInGameIds}
          onTogglePlayer={handleTogglePlayer}
        />
      </div>
    </div>
  );
}
