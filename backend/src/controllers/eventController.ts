import { Request, Response } from 'express';
import prisma from "../utils/prismaClient";
import { 
  excludeDeletedEvent, 
  excludeDeletedPlayer,
  excludeDeletedPokemon,
  softDeleteEventData, 
  updateEventData,
  restoreEventData 
} from "../utils/softDelete";

// Create a new event (register a Pokémon event)
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const { pokemonId, route, nickname, status, isShiny, isChamp, gameId, playerId } = req.body;

  try {
    // Create the event in the database
    const newEvent = await prisma.event.create({
      data: {
        pokemonId,
        route,
        nickname,
        status: status || 'Catched', // Default to 'Catched' if not provided
        isShiny,
        isChamp,
        gameId,
        playerId, // Directly associate the event with a player
      },
      include: {
        player: true, // Include player details in the response
        pokemon: true, // Include Pokémon details in the response
      },
    });

    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};


// Search Pokémon by part of their name
export const searchPokemon = async (req: Request, res: Response): Promise<void> => {
  try {
    const searchTerm = req.query.searchTerm;

    if (typeof searchTerm === 'string') {
      const pokemons = await prisma.pokemon.findMany({
        where: {
          name: { contains: searchTerm.toLowerCase() }, // Case-insensitive search
          ...excludeDeletedPokemon(), // Exclude soft-deleted Pokémon
        },
        select: {
          id: true,
          name: true,
          form: true,
          image: true,
        },
      });

      res.json(pokemons);
    } else {
      res.status(400).json({ error: 'Invalid search term' });
    }
  } catch (error) {
    console.error('Error searching Pokémon:', error);
    res.status(500).json({ error: 'Failed to search Pokémon' });
  }
};


// Get all events (you can also filter by gameId or other criteria)
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Extract gameId from query parameters
    const { gameId } = req.query;

    // Build the filter condition
    const whereCondition = gameId 
      ? { gameId: Number(gameId), ...excludeDeletedEvent() } 
      : excludeDeletedEvent();

    const events = await prisma.event.findMany({
      where: whereCondition, // Apply the filter if gameId is provided
      include: {
        player: true,
        pokemon: true,
      },
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};


// Get events by Game ID
export const getEventsByGameId = async (req: Request, res: Response): Promise<void> => {
  const { gameId } = req.params;

  try {
    const events = await prisma.event.findMany({
      where: { 
        gameId: parseInt(gameId),
        ...excludeDeletedEvent(),
      },
      include: {
        player: true,
        pokemon: true,
      },
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching events for game:', error);
    res.status(500).json({ error: 'Failed to fetch events for the game' });
  }
};


export const updateEventStatus = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;
  const { status } = req.body;

  // Validate input
  const validStatuses = ['Catched', 'Run Away', 'Defeated'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Invalid status provided.' });
    return;
  }

  try {
    // Check if event exists and is not soft-deleted
    const existingEvent = await prisma.event.findFirst({
      where: { 
        id: Number(eventId),
        ...excludeDeletedEvent(),
      },
    });

    if (!existingEvent) {
      res.status(404).json({ error: 'Event not found or has been deleted.' });
      return;
    }

    // Update event status with updatedAt timestamp
    const updatedEvent = await prisma.event.update({
      where: { id: Number(eventId) },
      data: updateEventData({ status }),
    });

    res.status(200).json({ message: 'Status updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({ error: 'Failed to update event status.' });
  }
};

export const updateEventAttributes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;
    const { isShiny, isChamp } = req.body;

    // Validate input
    if (typeof isShiny !== 'number' || typeof isChamp !== 'number') {
      res.status(400).json({ error: "Invalid input. 'isShiny' and 'isChamp' must be numbers." });
      return;
    }

    // Check if event exists and is not soft-deleted
    const existingEvent = await prisma.event.findFirst({
      where: { 
        id: Number(eventId),
        ...excludeDeletedEvent(),
      },
    });

    if (!existingEvent) {
      res.status(404).json({ error: 'Event not found or has been deleted.' });
      return;
    }

    // Update the event with updatedAt timestamp
    const updatedEvent = await prisma.event.update({
      where: { id: Number(eventId) },
      data: updateEventData({ 
        isShiny,
        isChamp 
      }),
    });

    res.status(200).json({
      message: 'Event attributes updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    console.error('Error updating event attributes:', error);
    res.status(500).json({
      error: 'Failed to update event attributes.',
    });
  }
};

// Soft Delete Event by ID
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  try {
    // Find the event to ensure it exists and is not already soft-deleted
    const event = await prisma.event.findFirst({
      where: { 
        id: parseInt(eventId),
        ...excludeDeletedEvent(),
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Event not found or already deleted.' });
      return;
    }

    // Soft delete the event
    await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: softDeleteEventData(),
    });

    res.status(200).json({ message: 'Event successfully deleted.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'An error occurred while deleting the event.' });
  }
};

// Restore soft-deleted Event by ID
export const restoreEvent = async (req: Request, res: Response): Promise<void> => {
  const { eventId } = req.params;

  try {
    // Find the soft-deleted event
    const event = await prisma.event.findFirst({
      where: { 
        id: parseInt(eventId),
        deletedAt: { not: null },
      },
    });

    if (!event) {
      res.status(404).json({ message: 'Deleted event not found.' });
      return;
    }

    // Restore the event
    const restoredEvent = await prisma.event.update({
      where: { id: parseInt(eventId) },
      data: restoreEventData(),
    });

    res.status(200).json({ 
      message: 'Event successfully restored.',
      event: restoredEvent,
    });
  } catch (error) {
    console.error('Error restoring event:', error);
    res.status(500).json({ message: 'An error occurred while restoring the event.' });
  }
};
