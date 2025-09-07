interface PokedexHeaderProps {}

export function PokedexHeader({}: PokedexHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-extrabold text-gray-800">Pokédex</h1>
      <p className="text-gray-600 mt-2">
        Explora y gestiona todos los Pokémon
      </p>
    </div>
  );
}
