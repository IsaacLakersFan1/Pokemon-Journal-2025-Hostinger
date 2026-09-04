/**
 * Resolve a Pokémon sprite URL from a stored image key or absolute URL.
 * Uses the legacy public image host (same as before the local /public change).
 */
const IMAGE_BASE =
  "http://goc4840sk8cc4cws448osgoo.193.46.198.43.sslip.io/public/PokemonImages";

export function pokemonImageUrl(
  image?: string | null,
  options?: { shiny?: boolean; shinyImage?: string | null }
): string {
  const fallback = "https://github.com/shadcn.png";
  const key =
    options?.shiny && options.shinyImage
      ? options.shinyImage
      : image;

  if (!key) return fallback;
  if (key.startsWith("http://") || key.startsWith("https://")) return key;

  // Legacy format stored the filename without extension
  const file = key.endsWith(".png") ? key : `${key}.png`;
  return `${IMAGE_BASE}/${file}`;
}

export function playerAvatarUrl(): string {
  return `${IMAGE_BASE}/player.png`;
}

export function pokeballImageUrl(): string {
  return `${IMAGE_BASE}/pokeball.png`;
}
