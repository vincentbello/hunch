// @flow
import { createSelector } from 'reselect';
import { HUNCH_VIEW_TYPES } from 'constants/view-types';
import { type HunchListType } from 'types/hunch';
import { type ReduxState } from 'types/state';

export const getViewIndex = (state: ReduxState): number => state.views.hunchLists.viewIndex;

export const getHunchListType = createSelector(getViewIndex, (index: number): HunchListType => HUNCH_VIEW_TYPES[index].key);
