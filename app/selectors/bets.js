// @flow
import { createSelector } from 'reselect';
import { getEntity, idsToList } from 'utils/normalization';
import { type Bet } from 'types/bet';
import { type Entities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';

const getEntities = (state: ReduxState): Entities => state.entities;

export const getBets = createSelector(
  getEntities,
  (state: ReduxState, props: { listType: string }): PromiseState<Array<number>> => state.views.betLists[props.listType || 'active'],
  (entities: Entities, list: PromiseState<Array<number>>): PromiseState<Array<Bet>> => {
    if (list.data === null) return list;

    return {
      ...list,
      data: idsToList(entities.bets, list.data, { bettor: 'users', bettee: 'users' }, entities),
    };
  },
);

export const getBet = createSelector(
  getEntities,
  (_: ReduxState, props: { betId: number }): number => props.betId,
  (state: ReduxState): PromiseState<Bet> => state.views.betCard,
  (entities: Entities, betId: number, betPS: PromiseState<Bet>): PromiseState<Bet> => {
    if (!(betId in entities.bets)) return betPS;

    return {
      ...betPS,
      data: getEntity(entities.bets, betId, { bettor: 'users', bettee: 'users', game: 'games' }, entities),
    };
  },
);
