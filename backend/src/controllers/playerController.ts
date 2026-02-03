// src/controllers/playerController.ts
import { Request, Response } from 'express';
import prisma from "../utils/prismaClient";
import { PokemonType } from '../types.d';
import { 
  excludeDeletedPlayer, 
  excludeDeletedPokemon,
  excludeDeletedEvent,
  excludeDeletedPlayerGame,
  excludeDeletedGame,
  softDeletePlayerData, 
  updatePlayerData,
  restorePlayerData 
} from "../utils/softDelete";

interface AuthenticatedRequest extends Request {
    user?: {
      userId: number; // The type of `userId` that you'll get from the JWT payload
    };
  }

  interface PokemonStat {
    timesCaptured: number;
    shinyCapture: string;
  }

  // Type Guard for Pokemon Type
function isValidPokemonType(type: string): type is PokemonType {
  const validTypes: PokemonType[] = [
    "Bug", "Dark", "Dragon", "Electric", "Fairy", "Fighting", "Fire", "Flying",
    "Ghost", "Grass", "Ground", "Ice", "Normal", "Poison", "Psychic", "Rock", "Steel", "Water"
  ];
  return validTypes.includes(type as PokemonType);
}


// Create a new player
export const createPlayer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { name, pokemonId } = req.body;
    const userId = req.user?.userId;  // Extract userId from the authenticated user
  
    if (!userId) {
      res.status(400).json({ error: 'User not authenticated' });
      return;
    }
  
    try {
      const newPlayer = await prisma.player.create({
        data: {
          name,
          pokemonId,
          userId,  // Associate player with authenticated user
        },
      });
  
      res.status(201).json({ message: 'Player created successfully', player: newPlayer });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create player' });
    }
  };
  

// Update a player's information
export const updatePlayer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const playerId = parseInt(req.params.id);
  const { name, pokemonId } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the player exists, is not soft-deleted, and belongs to the user
    const player = await prisma.player.findFirst({
      where: { 
        id: playerId,
        ...excludeDeletedPlayer(),
      },
    });

    if (!player) {
      res.status(404).json({ error: 'Player not found or already deleted' });
      return;
    }

    if (player.userId !== userId) {
      res.status(403).json({ error: 'You are not authorized to update this player' });
      return;
    }

    const updatedPlayer = await prisma.player.update({
      where: { id: playerId },
      data: updatePlayerData({ name, pokemonId }),
    });

    res.status(200).json({ message: 'Player updated successfully', player: updatedPlayer });
  } catch (error) {
    console.error('Error updating player:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
};

// Soft Delete a player by ID
export const deletePlayer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const playerId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the player exists, is not soft-deleted, and belongs to the user
    const player = await prisma.player.findFirst({
      where: { 
        id: playerId,
        ...excludeDeletedPlayer(),
      },
    });

    if (!player) {
      res.status(404).json({ error: 'Player not found or already deleted' });
      return;
    }

    if (player.userId !== userId) {
      res.status(403).json({ error: 'You are not authorized to delete this player' });
      return;
    }

    // Soft delete the player
    await prisma.player.update({
      where: { id: playerId },
      data: softDeletePlayerData(),
    });

    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Failed to delete player' });
  }
};

// Restore soft-deleted player by ID
export const restorePlayer = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const playerId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  try {
    // Check if the soft-deleted player exists and belongs to the user
    const player = await prisma.player.findFirst({
      where: { 
        id: playerId,
        deletedAt: { not: null },
      },
    });

    if (!player) {
      res.status(404).json({ error: 'Deleted player not found' });
      return;
    }

    if (player.userId !== userId) {
      res.status(403).json({ error: 'You are not authorized to restore this player' });
      return;
    }

    // Restore the player
    const restoredPlayer = await prisma.player.update({
      where: { id: playerId },
      data: restorePlayerData(),
    });

    res.status(200).json({ 
      message: 'Player restored successfully',
      player: restoredPlayer,
    });
  } catch (error) {
    console.error('Error restoring player:', error);
    res.status(500).json({ error: 'Failed to restore player' });
  }
};

// Get players: ?scope=account = only current user (no merge). Otherwise all accounts merged by name.
export const getPlayers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(400).json({ error: 'User not authenticated' });
    return;
  }

  const scope = req.query.scope as string | undefined;
  const accountOnly = scope === 'account';

  try {
    const where = accountOnly
      ? { userId, ...excludeDeletedPlayer() }
      : excludeDeletedPlayer();

    const allPlayers = await prisma.player.findMany({
      where,
      include: {
        pokemon: true,
        playerGames: {
          include: { game: true },
        },
        events: true,
      },
    });

    if (accountOnly) {
      res.status(200).json(allPlayers);
      return;
    }

    const byName = new Map<string, (typeof allPlayers)[0]>();
    for (const p of allPlayers) {
      if (!byName.has(p.name)) {
        byName.set(p.name, p);
      }
    }
    const players = Array.from(byName.values());
    res.status(200).json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

// Returns all player IDs that have the same name as the given player (across all accounts)
async function getPlayerIdsByName(playerId: number): Promise<number[]> {
  const player = await prisma.player.findFirst({
    where: { id: playerId, ...excludeDeletedPlayer() },
    select: { name: true },
  });
  if (!player) return [];
  const sameName = await prisma.player.findMany({
    where: { name: player.name, ...excludeDeletedPlayer() },
    select: { id: true },
  });
  return sameName.map((p) => p.id);
}

// Trainer Stats Endpoint (aggregates stats for all players with same name across accounts)
export const getTrainerStats = async (req: Request, res: Response): Promise<void> => {
  const playerIdNum = parseInt(req.params.playerId);
  const { gameId } = req.query;

  try {
    const playerIds = await getPlayerIdsByName(playerIdNum);
    if (playerIds.length === 0) {
      res.status(404).json({ message: 'Player not found or deleted' });
      return;
    }

    const player = await prisma.player.findFirst({
      where: { id: playerIds[0], ...excludeDeletedPlayer() },
      include: { pokemon: true },
    });
    if (!player) {
      res.status(404).json({ message: 'Player not found or deleted' });
      return;
    }

    const events = await prisma.event.findMany({
      where: {
        playerId: { in: playerIds },
        ...(gameId ? { gameId: parseInt(gameId as string) } : {}),
        ...excludeDeletedEvent(),
        game: { deletedAt: null },
      },
      include: { pokemon: true },
    });

    // Initialize stats object
    const stats = {
      playerName: player.name, // Add player name
      pokemon: player.pokemon, // Add player's Pokémon data
      caught: 0,
      runaway: 0,
      defeated: 0,
      shiny: 0,
      typeCounts: {
        Bug: 0,
        Dark: 0,
        Dragon: 0,
        Electric: 0,
        Fairy: 0,
        Fighting: 0,
        Fire: 0,
        Flying: 0,
        Ghost: 0,
        Grass: 0,
        Ground: 0,
        Ice: 0,
        Normal: 0,
        Poison: 0,
        Psychic: 0,
        Rock: 0,
        Steel: 0,
        Water: 0,
      },
    };

    // Iterate over events and calculate stats
    events.forEach((event) => {
      // Count statuses
      if (event.status === 'Catched') stats.caught++;
      if (event.status === 'Run Away') stats.runaway++;
      if (event.status === 'Defeated') stats.defeated++;

      // Count shinies
      if (event.isShiny === 1) stats.shiny++;

      // Count Pokémon types (both type1 and type2)
      if (event.pokemon) {
        const { type1, type2 } = event.pokemon;

        if (type1 && isValidPokemonType(type1)) {
          stats.typeCounts[type1 as PokemonType] = (stats.typeCounts[type1 as PokemonType] || 0) + 1;
        }

        if (type2 && isValidPokemonType(type2)) {
          stats.typeCounts[type2 as PokemonType] = (stats.typeCounts[type2 as PokemonType] || 0) + 1;
        }
      }
    });

    // Respond with the calculated stats and player information
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching trainer stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Trainer Stats by Pokémon (aggregates for all players with same name)
export const getPokemonsStats = async (req: Request, res: Response): Promise<void> => {
  const playerId = parseInt(req.params.playerId);

  try {
    const playerIds = await getPlayerIdsByName(playerId);
    if (playerIds.length === 0) {
      res.status(404).json({ message: 'Player not found or deleted' });
      return;
    }

    const pokemons = await prisma.pokemon.findMany({
      where: {
        ...excludeDeletedPokemon(),
        events: {
          some: {
            playerId: { in: playerIds },
            ...excludeDeletedEvent(),
            game: { deletedAt: null },
          },
        },
      },
      include: {
        events: {
          where: {
            playerId: { in: playerIds },
            ...excludeDeletedEvent(),
            game: { deletedAt: null },
          },
          select: { id: true, isShiny: true },
        },
      },
    });

    const allShowdowns = await prisma.showdown.findMany({
      where: { deletedAt: null },
      select: { winnerId: true, mvpEventId: true, player1EventIds: true, player2EventIds: true },
    });

    const pokemonStats = pokemons.map((pokemon) => {
      const timesCaptured = pokemon.events.length;
      const shinyCapture = pokemon.events.some((event) => event.isShiny === 1) ? 'yes' : 'no';
      const eventIds = pokemon.events.map((e) => e.id);
      let showdownWins = 0;
      let mvpCount = 0;
      for (const s of allShowdowns) {
        const p1Ids = parseEventIds(s.player1EventIds);
        const p2Ids = parseEventIds(s.player2EventIds);
        const inShowdown = eventIds.some((id) => p1Ids.includes(id) || p2Ids.includes(id));
        if (!inShowdown) continue;
        if (playerIds.includes(s.winnerId)) showdownWins += 1;
        if (s.mvpEventId && eventIds.includes(s.mvpEventId)) mvpCount += 1;
      }

      return {
        id: pokemon.id,
        type1: pokemon.type1,
        type2: pokemon.type2,
        name: pokemon.name,
        form: pokemon.form,
        timesCaptured,
        shinyCapture,
        image: pokemon.image || null,
        shinyImage: pokemon.shinyImage || null,
        showdownWins,
        mvpCount,
      };
    });

    res.json(pokemonStats);
  } catch (error) {
    console.error('Error fetching Pokémon stats:', error);
    res.status(500).json({ message: 'An error occurred while fetching Pokémon stats.' });
  }
};

function parseEventIds(json: string): number[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.map(Number).filter((n) => !isNaN(n)) : [];
  } catch {
    return [];
  }
}

// Pokemon detail for player (aggregates for all players with same name; showdown stats, per-game list)
export const getPokemonDetail = async (req: Request, res: Response): Promise<void> => {
  const playerId = parseInt(req.params.playerId);
  const pokemonId = parseInt(req.params.pokemonId);

  try {
    const playerIds = await getPlayerIdsByName(playerId);
    if (playerIds.length === 0) {
      res.status(404).json({ message: 'Player not found or deleted' });
      return;
    }

    const events = await prisma.event.findMany({
      where: {
        playerId: { in: playerIds },
        pokemonId,
        ...excludeDeletedEvent(),
        game: { deletedAt: null },
      },
      include: {
        game: { select: { id: true, name: true } },
        pokemon: { select: { id: true, name: true, form: true, type1: true, type2: true, image: true, shinyImage: true } },
      },
    });

    if (events.length === 0) {
      res.status(404).json({ message: 'No events found for this player and pokemon' });
      return;
    }

    const eventIds = events.map((e) => e.id);
    const showdowns = await prisma.showdown.findMany({
      where: { deletedAt: null },
      select: { id: true, winnerId: true, mvpEventId: true, gameId: true, player1EventIds: true, player2EventIds: true },
    });

    let showdownBattles = 0;
    let showdownWins = 0;
    let mvpCount = 0;
    for (const s of showdowns) {
      const p1Ids = parseEventIds(s.player1EventIds);
      const p2Ids = parseEventIds(s.player2EventIds);
      const inShowdown = eventIds.some((id) => p1Ids.includes(id) || p2Ids.includes(id));
      if (!inShowdown) continue;
      showdownBattles += 1;
      if (playerIds.includes(s.winnerId)) showdownWins += 1;
      if (s.mvpEventId && eventIds.includes(s.mvpEventId)) mvpCount += 1;
    }

    const leagueWins = events.filter((e) => e.isChamp === 1).length;
    const defeatedCount = events.filter((e) => e.status === 'Defeated').length;
    const escapedCount = events.filter((e) => e.status === 'Run Away').length;

    const showdownsByGame = await prisma.showdown.findMany({
      where: { deletedAt: null },
      select: { id: true, mvpEventId: true, gameId: true },
    });

    const eventsByGameMap = new Map<number, { gameId: number; gameName: string; events: Array<{ eventId: number; nickname: string | null; status: string | null; isShiny: number; isChamp: number; mvpCountInGame: number }> }>();

    for (const e of events) {
      const gameId = e.gameId;
      const gameName = e.game.name;
      if (!eventsByGameMap.has(gameId)) {
        eventsByGameMap.set(gameId, { gameId, gameName, events: [] });
      }
      const showdownsInGame = showdownsByGame.filter((s) => s.gameId === gameId);
      const mvpCountInGame = showdownsInGame.filter((s) => s.mvpEventId === e.id).length;
      eventsByGameMap.get(gameId)!.events.push({
        eventId: e.id,
        nickname: e.nickname,
        status: e.status,
        isShiny: e.isShiny,
        isChamp: e.isChamp,
        mvpCountInGame,
      });
    }

    const eventsByGame = Array.from(eventsByGameMap.values());
    const pokemon = events[0].pokemon;

    res.json({
      pokemon: pokemon ? { id: pokemon.id, name: pokemon.name, form: pokemon.form, type1: pokemon.type1, type2: pokemon.type2, image: pokemon.image, shinyImage: pokemon.shinyImage } : null,
      showdownBattles,
      showdownWins,
      mvpCount,
      leagueWins,
      defeatedCount,
      escapedCount,
      timesCaptured: events.length,
      eventsByGame,
    });
  } catch (error) {
    console.error('Error fetching Pokémon detail:', error);
    res.status(500).json({ message: 'An error occurred while fetching Pokémon detail.' });
  }
};





export default getTrainerStats;