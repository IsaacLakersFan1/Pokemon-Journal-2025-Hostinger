/**
 * Resolve a Pokémon sprite URL from a stored image key or absolute URL.
 */
import API_URL from "@/utils/apiConfig";

export function pokemonImageUrl(
  image?: string | null,
  options?: { shiny?: boolean; shinyImage?: string | null }
): string {
  const fallback = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
  const key =
    options?.shiny && options.shinyImage
      ? options.shinyImage
      : image;

  if (!key) return fallback;
  if (key.startsWith("http://") || key.startsWith("https://")) return key;

  const file = key.endsWith(".png") ? key : `${key}.png`;
  return `${API_URL}/public/PokemonImages/${file}`;
}

export function playerAvatarUrl(): string {
  return `${API_URL}/public/PokemonImages/player.png`;
}
