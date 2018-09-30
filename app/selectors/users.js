// @flow
import { createSelector } from 'reselect';
import { getEntity, idsToList } from 'utils/normalization';
import { type User } from 'types/user';
import { type UserEntities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';

const getEntities = (state: ReduxState): Entities => state.entities;

export const getNewBetUsers = createSelector(
  (state: ReduxState): UserEntities => state.entities.users,
  (state: ReduxState): PromiseState<Array<number>> => state.views.createBet.users,
  (users: UserEntities, usersPS: PromiseState<Array<number>>): PromiseState<Array<User>> => {
    if (usersPS.data === null) return usersPS;
    return { ...usersPS, data: idsToList(users, usersPS.data) };
  },
);
