// @flow
import { createSelector } from 'reselect';
import { DATE_VIEW_TYPES } from 'constants/view-types';
import { getEntity, idsToList } from 'utils/normalization';

import { type Game } from 'types/game';
import { type Team } from 'types/team';
import { type User } from 'types/user';
import { type AllEntities, type TeamEntities, type UserEntities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';

const getEntities = (state: ReduxState): AllEntities => state.entities;
const getTeamEntities = (state: ReduxState): TeamEntities => state.entities.teams;
const getUserEntities = (state: ReduxState): UserEntities => state.entities.users;

export const getBetAmount = (state: ReduxState): number => state.views.createBet.amount;
export const getCreationPromiseState = (state: ReduxState): PromiseState<> => state.views.createBet.creation;
export const getDateViewIndex = (state: ReduxState): number => state.views.createBet.dateViewIndex;

export const getBettee = createSelector(
  getUserEntities,
  (state: ReduxState): number | null => state.views.createBet.betteeId,
  getEntity
);

export const getBettorPickTeam = createSelector(
  getTeamEntities,
  (state: ReduxState): number | null => state.views.createBet.bettorPickTeamId,
  (teamEntities: TeamEntities, bettorPickTeamId: number | null): Team | null => (
    bettorPickTeamId === null ? null : getEntity(teamEntities, bettorPickTeamId)
  )
);

export const getDateViewType = createSelector(getDateViewIndex, (index: number): string => DATE_VIEW_TYPES[index].key);

export const getGame = createSelector(
  getEntities,
  (state: ReduxState): number | null => state.views.createBet.gameId,
  (entities: AllEntities, gameId: number | null): Game | null => {
    if (gameId === null) return null;
    return getEntity(entities.games, gameId, { homeTeam: 'teams', awayTeam: 'teams' }, entities);
  }
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
  (state: ReduxState): PromiseState<Array<number>> => state.views.createBet.games[DATE_VIEW_TYPES[state.views.createBet.dateViewIndex].key],
  (entities: AllEntities, gamesPS: PromiseState<Array<number>>): PromiseState<Array<Game>> => {
    if (gamesPS.data === null) return gamesPS;

    return {
      ...gamesPS,
      data: idsToList(entities.games, gamesPS.data, { homeTeam: 'teams', awayTeam: 'teams' }, entities),
    };
  },
);
