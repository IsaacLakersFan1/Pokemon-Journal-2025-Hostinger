import { Request, Response } from 'express';
import prisma from "../utils/prismaClient";
import { 
  excludeDeletedPokemon, 
  updatePokemonData 
} from "../utils/softDelete";

export const updatePokemonImages = async (req: Request, res: Response) => {
    try {
      // Fetch all non-deleted Pokémon records
      const pokemons = await prisma.pokemon.findMany({
        where: excludeDeletedPokemon(),
      });
  
      // Prepare update promises
      const updatePromises = pokemons.map((pokemon) =>
        prisma.pokemon.update({
          where: { id: pokemon.id },
          data: updatePokemonData({
            image: (pokemon.name ?? "unknown").toLowerCase(),
            shinyImage: `${(pokemon.name ?? "unknown").toLowerCase()}-shiny`,
          }),
        })
      );
  
      // Execute updates
      await Promise.all(updatePromises);
  
      res.status(200).json({ 
        message: "Pokemon images updated successfully!",
        updatedCount: pokemons.length,
      });
    } catch (error) {
      console.error("Error updating Pokémon images:", error);
      res.status(500).json({ error: "Failed to update Pokémon images." });
    }
  };

// Get database statistics
export const getDatabaseStats = async (req: Request, res: Response) => {
  try {
    const stats = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.game.count({ where: { deletedAt: null } }),
      prisma.player.count({ where: { deletedAt: null } }),
      prisma.pokemon.count({ where: { deletedAt: null } }),
      prisma.event.count({ where: { deletedAt: null } }),
      prisma.playerGame.count({ where: { deletedAt: null } }),
    ]);

    const [users, games, players, pokemons, events, playerGames] = stats;

    res.status(200).json({
      message: "Database statistics retrieved successfully",
      stats: {
        users,
        games,
        players,
        pokemons,
        events,
        playerGames,
      },
    });
  } catch (error) {
    console.error("Error fetching database statistics:", error);
    res.status(500).json({ error: "Failed to fetch database statistics." });
  }
};