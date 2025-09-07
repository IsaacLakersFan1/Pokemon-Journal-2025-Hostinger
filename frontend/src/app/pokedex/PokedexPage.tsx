import { usePokedex } from "./hooks/usePokedex";
import { PokedexHeader } from "./components/PokedexHeader";
import { SearchAndCreateSection } from "./components/SearchAndCreateSection";
import { PokemonGrid } from "./components/PokemonGrid";
import { CreatePokemonForm } from "./components/CreatePokemonForm";
import { EditPokedexCard } from "./components/EditPokedexCard";
import { InformationPokedexCard } from "../dashboard/components/InformationPokedexCard";
import { PokedexLoadingScreen } from "./components/PokedexLoadingScreen";
import { PokedexErrorScreen } from "./components/PokedexErrorScreen";

export function PokedexPage() {
  const {
    filteredPokemons,
    searchTerm,
    selectedPokemon,
    typeEffectiveness,
    modalState,
    loading,
    error,
    handleSearch,
    openModal,
    closeModal,
    handleCreatePokemon,
    handleUpdatePokemon,
  } = usePokedex();

  if (loading) {
    return <PokedexLoadingScreen />;
  }

  if (error) {
    return <PokedexErrorScreen error={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PokedexHeader />
      
      <SearchAndCreateSection
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onCreateClick={() => openModal("create")}
      />

      <PokemonGrid
        pokemons={filteredPokemons}
        onInfoClick={(pokemon) => openModal("info", pokemon)}
        onEditClick={(pokemon) => openModal("edit", pokemon)}
      />

      {/* Information Pokémon Modal */}
      {modalState.info && selectedPokemon && (
        <InformationPokedexCard
          pokemon={selectedPokemon}
          typeEffectiveness={typeEffectiveness}
          onClose={() => closeModal("info")}
        />
      )}

      {/* Create Pokémon Modal */}
      <CreatePokemonForm
        isOpen={modalState.create}
        onClose={() => closeModal("create")}
        onCreate={handleCreatePokemon}
      />

      {/* Edit Pokémon Modal */}
      {modalState.edit && selectedPokemon && (
        <EditPokedexCard
          isOpen={modalState.edit}
          pokemon={selectedPokemon}
          onUpdate={handleUpdatePokemon}
          onClose={() => closeModal("edit")}
        />
      )}
    </div>
  );
}
