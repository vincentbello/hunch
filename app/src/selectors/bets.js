// @flow
import { createSelector } from 'reselect';
import { BET_VIEW_TYPES } from 'constants/view-types';
import { getEntity, idsToList } from 'utils/normalization';
import { type ReduxState as BetListsState } from 'reducers/views/betLists';
import { type Bet, type ViewType } from 'types/bet';
import { type AllEntities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';

const getEntities = (state: ReduxState): AllEntities => state.entities;
const getTypePromiseState = createSelector(
  (state: ReduxState): BetListsState => state.views.betLists,
  (state: ReduxState, props: { viewType?: ViewType }): ViewType =>
    (props && props.viewType) ? props.viewType : BET_VIEW_TYPES[state.views.betLists.viewIndex].key,
  (betLists: BetListsState, viewType: ViewType): PromiseState<Array<number>> => betLists[viewType]
);

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

export const getViewIndex = (state: ReduxState): number => state.views.betLists.viewIndex;

export const getViewType = createSelector(getViewIndex, (index: number): ViewType => BET_VIEW_TYPES[index].key);
