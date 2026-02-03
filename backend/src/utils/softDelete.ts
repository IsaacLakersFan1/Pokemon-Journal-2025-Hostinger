/**
 * Utility functions for soft delete operations in Pokemon Journal
 */

/**
 * Creates a where clause that excludes soft-deleted records
 */
export const excludeDeleted = () => ({
  deletedAt: null,
});

/**
 * Creates a where clause for User that excludes soft-deleted records
 */
export const excludeDeletedUser = () => ({
  deletedAt: null,
});

/**
 * Creates a where clause for Game that excludes soft-deleted records
 */
export const excludeDeletedGame = () => ({
  deletedAt: null,
});

/**
 * Creates a where clause for Player that excludes soft-deleted records
 */
export const excludeDeletedPlayer = () => ({
  deletedAt: null,
});

/**
 * Creates a where clause for Pokemon that excludes soft-deleted records
 */
export const excludeDeletedPokemon = () => ({
  deletedAt: null,
});

/**
 * Creates a where clause for Event that excludes soft-deleted records
 */
export const excludeDeletedEvent = () => ({
  deletedAt: null,
});

/**
 * Creates a where clause for PlayerGame that excludes soft-deleted records
 */
export const excludeDeletedPlayerGame = () => ({
  deletedAt: null,
});

/**
 * Creates a where clause for Showdown that excludes soft-deleted records
 */
export const excludeDeletedShowdown = () => ({
  deletedAt: null,
});

/**
 * Creates soft delete data for any model
 */
export const softDeleteData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates soft delete data for User model
 */
export const softDeleteUserData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates soft delete data for Game model
 */
export const softDeleteGameData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates soft delete data for Player model
 */
export const softDeletePlayerData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates soft delete data for Pokemon model
 */
export const softDeletePokemonData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates soft delete data for Event model
 */
export const softDeleteEventData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates soft delete data for PlayerGame model
 */
export const softDeletePlayerGameData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates soft delete data for Showdown model
 */
export const softDeleteShowdownData = () => ({
  deletedAt: new Date(),
});

/**
 * Creates update data with updatedAt timestamp
 */
export const updateData = <T extends Record<string, any>>(data: T): T & { updatedAt: Date } => ({
  ...data,
  updatedAt: new Date(),
});

/**
 * Creates update data with updatedAt timestamp for User
 */
export const updateUserData = <T extends Record<string, any>>(data: T): T & { updatedAt: Date } => ({
  ...data,
  updatedAt: new Date(),
});

/**
 * Creates update data with updatedAt timestamp for Game
 */
export const updateGameData = <T extends Record<string, any>>(data: T): T & { updatedAt: Date } => ({
  ...data,
  updatedAt: new Date(),
});

/**
 * Creates update data with updatedAt timestamp for Player
 */
export const updatePlayerData = <T extends Record<string, any>>(data: T): T & { updatedAt: Date } => ({
  ...data,
  updatedAt: new Date(),
});

/**
 * Creates update data with updatedAt timestamp for Pokemon
 */
export const updatePokemonData = <T extends Record<string, any>>(data: T): T & { updatedAt: Date } => ({
  ...data,
  updatedAt: new Date(),
});

/**
 * Creates update data with updatedAt timestamp for Event
 */
export const updateEventData = <T extends Record<string, any>>(data: T): T & { updatedAt: Date } => ({
  ...data,
  updatedAt: new Date(),
});

/**
 * Creates update data with updatedAt timestamp for PlayerGame
 */
export const updatePlayerGameData = <T extends Record<string, any>>(data: T): T & { updatedAt: Date } => ({
  ...data,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted record
 */
export const restoreData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted User record
 */
export const restoreUserData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted Game record
 */
export const restoreGameData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted Player record
 */
export const restorePlayerData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted Pokemon record
 */
export const restorePokemonData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted Event record
 */
export const restoreEventData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted PlayerGame record
 */
export const restorePlayerGameData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});

/**
 * Restores a soft-deleted Showdown record
 */
export const restoreShowdownData = () => ({
  deletedAt: null,
  updatedAt: new Date(),
});
