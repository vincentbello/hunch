// @flow
import { createSelector } from 'reselect';
import { getEntity, idsToList } from 'utils/normalization';
import { type Bet } from 'types/bet';
import { type AllEntities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';

const getEntities = (state: ReduxState): AllEntities => state.entities;
const getTypePromiseState = (state: ReduxState, props: { listType: string }): PromiseState<Array<number>> => {
  return state.views.betLists[props.listType || 'active'];
};

export const getBets = createSelector(
  getEntities,
  getTypePromiseState,
  (entities: AllEntities, list: PromiseState<Array<number>>): PromiseState<Array<Bet>> => {
    if (list.data === null) return list;

    return {
      ...list,
      data: idsToList(entities.bets, list.data, { bettor: 'users', bettee: 'users' }, entities),
    };
  },
);

export const getNumBets = createSelector(
  getTypePromiseState,
  (promiseState: PromiseState<Array<number>>): number => promiseState.data === null ? 0 : promiseState.data.length
);

export const getBet = createSelector(
  getEntities,
  (_: ReduxState, props: { betId: number }): number => props.betId,
  (state: ReduxState): PromiseState<Bet> => state.views.betCard,
  (entities: AllEntities, betId: number, betPS: PromiseState<Bet>): PromiseState<Bet> => {
    if (!(betId in entities.bets)) return betPS;

    return {
      ...betPS,
      data: getEntity(entities.bets, betId, { bettor: 'users', bettee: 'users', game: 'games' }, entities),
    };
  },
);

export const getRespondingBetId = (state: ReduxState): number | null => (
  state.views.betLists.response.isLoading && state.views.betLists.response.meta !== null ? state.views.betLists.response.meta.betId : null
);
