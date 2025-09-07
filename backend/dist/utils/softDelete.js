"use strict";
/**
 * Utility functions for soft delete operations in Pokemon Journal
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.restorePlayerGameData = exports.restoreEventData = exports.restorePokemonData = exports.restorePlayerData = exports.restoreGameData = exports.restoreUserData = exports.restoreData = exports.updatePlayerGameData = exports.updateEventData = exports.updatePokemonData = exports.updatePlayerData = exports.updateGameData = exports.updateUserData = exports.updateData = exports.softDeletePlayerGameData = exports.softDeleteEventData = exports.softDeletePokemonData = exports.softDeletePlayerData = exports.softDeleteGameData = exports.softDeleteUserData = exports.softDeleteData = exports.excludeDeletedPlayerGame = exports.excludeDeletedEvent = exports.excludeDeletedPokemon = exports.excludeDeletedPlayer = exports.excludeDeletedGame = exports.excludeDeletedUser = exports.excludeDeleted = void 0;
/**
 * Creates a where clause that excludes soft-deleted records
 */
const excludeDeleted = () => ({
    deletedAt: null,
});
exports.excludeDeleted = excludeDeleted;
/**
 * Creates a where clause for User that excludes soft-deleted records
 */
const excludeDeletedUser = () => ({
    deletedAt: null,
});
exports.excludeDeletedUser = excludeDeletedUser;
/**
 * Creates a where clause for Game that excludes soft-deleted records
 */
const excludeDeletedGame = () => ({
    deletedAt: null,
});
exports.excludeDeletedGame = excludeDeletedGame;
/**
 * Creates a where clause for Player that excludes soft-deleted records
 */
const excludeDeletedPlayer = () => ({
    deletedAt: null,
});
exports.excludeDeletedPlayer = excludeDeletedPlayer;
/**
 * Creates a where clause for Pokemon that excludes soft-deleted records
 */
const excludeDeletedPokemon = () => ({
    deletedAt: null,
});
exports.excludeDeletedPokemon = excludeDeletedPokemon;
/**
 * Creates a where clause for Event that excludes soft-deleted records
 */
const excludeDeletedEvent = () => ({
    deletedAt: null,
});
exports.excludeDeletedEvent = excludeDeletedEvent;
/**
 * Creates a where clause for PlayerGame that excludes soft-deleted records
 */
const excludeDeletedPlayerGame = () => ({
    deletedAt: null,
});
exports.excludeDeletedPlayerGame = excludeDeletedPlayerGame;
/**
 * Creates soft delete data for any model
 */
const softDeleteData = () => ({
    deletedAt: new Date(),
});
exports.softDeleteData = softDeleteData;
/**
 * Creates soft delete data for User model
 */
const softDeleteUserData = () => ({
    deletedAt: new Date(),
});
exports.softDeleteUserData = softDeleteUserData;
/**
 * Creates soft delete data for Game model
 */
const softDeleteGameData = () => ({
    deletedAt: new Date(),
});
exports.softDeleteGameData = softDeleteGameData;
/**
 * Creates soft delete data for Player model
 */
const softDeletePlayerData = () => ({
    deletedAt: new Date(),
});
exports.softDeletePlayerData = softDeletePlayerData;
/**
 * Creates soft delete data for Pokemon model
 */
const softDeletePokemonData = () => ({
    deletedAt: new Date(),
});
exports.softDeletePokemonData = softDeletePokemonData;
/**
 * Creates soft delete data for Event model
 */
const softDeleteEventData = () => ({
    deletedAt: new Date(),
});
exports.softDeleteEventData = softDeleteEventData;
/**
 * Creates soft delete data for PlayerGame model
 */
const softDeletePlayerGameData = () => ({
    deletedAt: new Date(),
});
exports.softDeletePlayerGameData = softDeletePlayerGameData;
/**
 * Creates update data with updatedAt timestamp
 */
const updateData = (data) => (Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
exports.updateData = updateData;
/**
 * Creates update data with updatedAt timestamp for User
 */
const updateUserData = (data) => (Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
exports.updateUserData = updateUserData;
/**
 * Creates update data with updatedAt timestamp for Game
 */
const updateGameData = (data) => (Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
exports.updateGameData = updateGameData;
/**
 * Creates update data with updatedAt timestamp for Player
 */
const updatePlayerData = (data) => (Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
exports.updatePlayerData = updatePlayerData;
/**
 * Creates update data with updatedAt timestamp for Pokemon
 */
const updatePokemonData = (data) => (Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
exports.updatePokemonData = updatePokemonData;
/**
 * Creates update data with updatedAt timestamp for Event
 */
const updateEventData = (data) => (Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
exports.updateEventData = updateEventData;
/**
 * Creates update data with updatedAt timestamp for PlayerGame
 */
const updatePlayerGameData = (data) => (Object.assign(Object.assign({}, data), { updatedAt: new Date() }));
exports.updatePlayerGameData = updatePlayerGameData;
/**
 * Restores a soft-deleted record
 */
const restoreData = () => ({
    deletedAt: null,
    updatedAt: new Date(),
});
exports.restoreData = restoreData;
/**
 * Restores a soft-deleted User record
 */
const restoreUserData = () => ({
    deletedAt: null,
    updatedAt: new Date(),
});
exports.restoreUserData = restoreUserData;
/**
 * Restores a soft-deleted Game record
 */
const restoreGameData = () => ({
    deletedAt: null,
    updatedAt: new Date(),
});
exports.restoreGameData = restoreGameData;
/**
 * Restores a soft-deleted Player record
 */
const restorePlayerData = () => ({
    deletedAt: null,
    updatedAt: new Date(),
});
exports.restorePlayerData = restorePlayerData;
/**
 * Restores a soft-deleted Pokemon record
 */
const restorePokemonData = () => ({
    deletedAt: null,
    updatedAt: new Date(),
});
exports.restorePokemonData = restorePokemonData;
/**
 * Restores a soft-deleted Event record
 */
const restoreEventData = () => ({
    deletedAt: null,
    updatedAt: new Date(),
});
exports.restoreEventData = restoreEventData;
/**
 * Restores a soft-deleted PlayerGame record
 */
const restorePlayerGameData = () => ({
    deletedAt: null,
    updatedAt: new Date(),
});
exports.restorePlayerGameData = restorePlayerGameData;
