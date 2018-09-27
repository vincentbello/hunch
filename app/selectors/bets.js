// @flow
import { createSelector } from 'reselect';
import { idsToList } from 'utils/normalization';
import { type Bet } from 'types/bet';
import { type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';
import { type BetEntities } from 'reducers/entities/bets';

export const getBets = createSelector(
  (state: ReduxState) => state.entities.bets,
  (state: ReduxState, props: { listType: string }) => state.views.betLists[props.listType || 'active'].data,
  (betEntities: BetEntities, list: PromiseState<Array<number>>): PromiseState<Array<Bet>> => {
    return (list.data === null) ? list : { ...list, data: idsToList(betEntities, list.data) };
  },
);
