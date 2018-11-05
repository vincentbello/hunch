// @flow
import { createSelector } from 'reselect';
import { BET_VIEW_TYPES } from 'constants/view-types';
import { type BetListType } from 'types/bet';
import { type ReduxState } from 'types/state';

export const getViewIndex = (state: ReduxState): number => state.views.betLists.viewIndex;

export const getBetListType = createSelector(getViewIndex, (index: number): BetListType => BET_VIEW_TYPES[index].key);
