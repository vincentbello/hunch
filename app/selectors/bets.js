// @flow
import { createSelector } from 'reselect';
import { idsToList } from 'utils/normalization';
import { type Bet } from 'types/bet';
import { type Entities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';

export const getBets = createSelector(
  (state: ReduxState) => state.entities,
  (state: ReduxState, props: { listType: string }) => state.views.betLists[props.listType || 'active'],
  (entities: Entities, list: PromiseState<Array<number>>): PromiseState<Array<Bet>> => {
    if (list.data === null) return list;

    return {
      ...list,
      data: idsToList(entities.bets, list.data, { bettor: 'users', bettee: 'users' }, entities),
    };
  },
);
