// @flow
import { createSelector } from 'reselect';
import { BET_VIEW_TYPES } from 'constants/view-types';
import { getEntity } from 'utils/normalization';
import { type Bet, type BetListType } from 'types/bet';
import { type AllEntities } from 'types/entities';
import { type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';

const getEntities = (state: ReduxState): AllEntities => state.entities;

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

export const getBetListType = createSelector(getViewIndex, (index: number): BetListType => BET_VIEW_TYPES[index].key);
