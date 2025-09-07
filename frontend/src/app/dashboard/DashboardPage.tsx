import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "./hooks/useDashboard";
import { DashboardHeader } from "./components/DashboardHeader";
import { CreateEventForm } from "./components/CreateEventForm";
import { EventsByPlayer } from "./components/EventsByPlayer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function DashboardPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const {
    pokemonQuery,
    setPokemonQuery,
    pokemonResults,
    selectedPokemon,
    setSelectedPokemon,
    route,
    setRoute,
    nickname,
    setNickname,
    players,
    selectedPlayerId,
    setSelectedPlayerId,
    status,
    setStatus,
    isSubmitting,
    events,
    handleCreateEvent,
  } = useDashboard();

  const handleCreateEventAndClose = async () => {
    await handleCreateEvent();
    setIsModalOpen(false);
  };

  if (!gameId) {
    return <div>Error: ID del juego no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Eventos del Juego</h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento Pokemon</DialogTitle>
              </DialogHeader>
              <CreateEventForm
                pokemonQuery={pokemonQuery}
                setPokemonQuery={setPokemonQuery}
                pokemonResults={pokemonResults}
                selectedPokemon={selectedPokemon}
                setSelectedPokemon={setSelectedPokemon}
                route={route}
                setRoute={setRoute}
                nickname={nickname}
                setNickname={setNickname}
                players={players}
                selectedPlayerId={selectedPlayerId}
                setSelectedPlayerId={setSelectedPlayerId}
                status={status}
                setStatus={setStatus}
                isSubmitting={isSubmitting}
                onCreateEvent={handleCreateEventAndClose}
              />
            </DialogContent>
          </Dialog>
        </div>

        <EventsByPlayer events={events} />
      </div>
    </div>
  );
}
