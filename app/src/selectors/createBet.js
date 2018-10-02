// @flow
import { createSelector } from 'reselect';
import { getEntity, idsToList } from 'utils/normalization';

import { type Game } from 'types/game';
import { type User } from 'types/user';
import { type AllEntities, type UserEntities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';

const getEntities = (state: ReduxState): AllEntities => state.entities;

const getUserEntities = (state: ReduxState): UserEntities => state.entities.users;

export const getBetAmount = (state: ReduxState): number => state.views.createBet.amount;

export const getGameId = (state: ReduxState): number | null => state.views.createBet.gameId;

export const getBettee = createSelector(
  getUserEntities,
  (state: ReduxState): number | null => state.views.createBet.betteeId,
  getEntity
);

export const getNewBetUsers = createSelector(
  getUserEntities,
  (state: ReduxState): PromiseState<Array<number>> => state.views.createBet.users,
  (users: UserEntities, usersPS: PromiseState<Array<number>>): PromiseState<Array<User>> => {
    if (usersPS.data === null) return usersPS;
    return { ...usersPS, data: idsToList(users, usersPS.data) };
  },
);

export const getGames = createSelector(
  getEntities,
  (state: ReduxState): PromiseState<Array<number>> => state.views.createBet.games,
  (entities: AllEntities, gamesPS: PromiseState<Array<number>>): PromiseState<Array<Game>> => {
    if (gamesPS.data === null) return gamesPS;

    return {
      ...gamesPS,
      data: idsToList(entities.games, gamesPS.data, { homeTeam: 'teams', awayTeam: 'teams' }, entities),
    };
  },
);
