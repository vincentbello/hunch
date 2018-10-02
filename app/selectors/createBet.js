// @flow
import { createSelector } from 'reselect';
import { getEntity, idsToList } from 'utils/normalization';
import { type User } from 'types/user';
import { type UserEntities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';

const getUserEntities = (state: ReduxState): UserEntities => state.entities.users;

export const getBetAmount = (state: ReduxState): number => state.views.createBet.amount;

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
