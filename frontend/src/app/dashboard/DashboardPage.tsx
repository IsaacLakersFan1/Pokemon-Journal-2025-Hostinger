import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "./hooks/useDashboard";
import { DashboardHeader } from "./components/DashboardHeader";
import { CreateEventForm } from "./components/CreateEventForm";
import { EventsByPlayer } from "./components/EventsByPlayer";
import { MatchupScoresSection } from "./components/MatchupScoresSection";
import { ShowdownInfoModal } from "./components/ShowdownInfoModal";
import { RegisterShowdownModal } from "./components/RegisterShowdownModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Info, Swords } from "lucide-react";

export function DashboardPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isShowdownModalOpen, setIsShowdownModalOpen] = useState(false);

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
    gameName,
    matchups,
    fetchShowdowns,
    handleCreateEvent,
  } = useDashboard();

  const handleCreateEventAndClose = async () => {
    await handleCreateEvent();
    setIsEventModalOpen(false);
  };

  const handleOpenInfoModal = () => {
    fetchShowdowns();
    setIsInfoModalOpen(true);
  };

  const handleShowdownSuccess = async () => {
    await fetchShowdowns();
  };

  if (!gameId) {
    return <div>Error: ID del juego no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      <div className="space-y-8">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold">
              Eventos del juego{gameName ? `: ${gameName}` : ""}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleOpenInfoModal}
              title="Ver enfrentamientos"
            >
              <Info className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsShowdownModalOpen(true)}>
              <Swords className="h-4 w-4 mr-2" />
              Registrar Showdown
            </Button>
            <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
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
        </div>

        <MatchupScoresSection matchups={matchups} />

        <EventsByPlayer events={events} matchups={matchups} players={players} />

        <ShowdownInfoModal
          open={isInfoModalOpen}
          onOpenChange={setIsInfoModalOpen}
          gameName={gameName}
          matchups={matchups}
          onRefresh={fetchShowdowns}
        />

        <RegisterShowdownModal
          open={isShowdownModalOpen}
          onOpenChange={setIsShowdownModalOpen}
          gameId={Number(gameId)}
          players={players}
          events={events}
          onSuccess={handleShowdownSuccess}
        />
      </div>
    </div>
  );
}
