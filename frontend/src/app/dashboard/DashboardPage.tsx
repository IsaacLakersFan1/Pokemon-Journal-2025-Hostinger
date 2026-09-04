import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "./hooks/useDashboard";
import { DashboardHeader } from "./components/DashboardHeader";
import { CreateEventForm } from "./components/CreateEventForm";
import { EventsByPlayer } from "./components/EventsByPlayer";
import { RegisterShowdownModal } from "./components/RegisterShowdownModal";
import { RunSummary } from "./components/RunSummary";
import { GraveyardSection } from "./components/GraveyardSection";
import { RouteChecklist } from "./components/RouteChecklist";
import { ShowdownsPanel } from "./components/ShowdownsPanel";
import { TrainerCompare } from "./components/TrainerCompare";
import { HallOfFame } from "./components/HallOfFame";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

export function DashboardPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
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
    isShiny,
    setIsShiny,
    isChamp,
    setIsChamp,
    isSubmitting,
    events,
    gameName,
    pokemonGame,
    notes,
    routeList,
    setRouteList,
    matchups,
    fetchEvents,
    fetchShowdowns,
    handleCreateEvent,
  } = useDashboard();

  const handleCreateEventAndClose = async () => {
    await handleCreateEvent();
    setIsEventModalOpen(false);
  };

  const showdownCount = matchups.reduce(
    (acc, m) => acc + (m.showdowns?.length ?? 0),
    0
  );

  if (!gameId) {
    return <div>Error: ID del juego no encontrado</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader
        gameId={gameId}
        gameName={gameName}
        pokemonGame={pokemonGame}
        notes={notes}
        playerCount={players.length}
      />

      <div className="space-y-6">
        <RunSummary events={events} showdownCount={showdownCount} />

        <Tabs defaultValue="encounters" className="w-full">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="encounters">Encuentros</TabsTrigger>
            <TabsTrigger value="routes">Rutas</TabsTrigger>
            <TabsTrigger value="showdowns">Showdowns</TabsTrigger>
            <TabsTrigger value="compare">Comparar</TabsTrigger>
            <TabsTrigger value="hof">Salón</TabsTrigger>
          </TabsList>

          <TabsContent value="encounters" className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-semibold">Encuentros</h2>
              <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Evento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Registrar encuentro</DialogTitle>
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
                    isShiny={isShiny}
                    setIsShiny={setIsShiny}
                    isChamp={isChamp}
                    setIsChamp={setIsChamp}
                    isSubmitting={isSubmitting}
                    onCreateEvent={handleCreateEventAndClose}
                    existingEvents={events}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <EventsByPlayer
              events={events}
              players={players}
              onRefresh={fetchEvents}
            />

            <GraveyardSection events={events} />
          </TabsContent>

          <TabsContent value="routes" className="mt-6">
            <RouteChecklist
              gameId={Number(gameId)}
              routeListRaw={routeList}
              players={players}
              events={events}
              onUpdated={(json) => setRouteList(json)}
            />
          </TabsContent>

          <TabsContent value="showdowns" className="mt-6">
            <ShowdownsPanel
              players={players}
              events={events}
              matchups={matchups}
              onRefresh={fetchShowdowns}
              onRegister={() => setIsShowdownModalOpen(true)}
            />
          </TabsContent>

          <TabsContent value="compare" className="mt-6">
            <TrainerCompare
              players={players}
              events={events}
              matchups={matchups}
            />
          </TabsContent>

          <TabsContent value="hof" className="mt-6">
            <HallOfFame
              gameName={gameName}
              pokemonGame={pokemonGame}
              players={players}
              events={events}
              matchups={matchups}
            />
          </TabsContent>
        </Tabs>
      </div>

      <RegisterShowdownModal
        open={isShowdownModalOpen}
        onOpenChange={setIsShowdownModalOpen}
        gameId={Number(gameId)}
        players={players}
        events={events}
        onSuccess={fetchShowdowns}
      />
    </div>
  );
}
