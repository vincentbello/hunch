// @flow
import { createSelector } from 'reselect';
import { DATE_VIEW_TYPES } from 'constants/view-types';
import { type User } from 'types/user';
import { type ReduxState } from 'types/state';

export const getHunchAmount = (state: ReduxState): number => state.views.createHunch.amount;

export const getBettee = (state: ReduxState): User | null => state.views.createHunch.bettee;

export const getBettorPickTeamId = (state: ReduxState): number | null => state.views.createHunch.bettorPickTeamId;

export const getDateViewIndex = (state: ReduxState): number => state.views.createHunch.dateViewIndex;

export const getDateViewType = createSelector(getDateViewIndex, (index: number): string => DATE_VIEW_TYPES[index].key);

export const getGameId = (state: ReduxState): number | null => state.views.createHunch.gameId;

export const getHunchWager = (state: ReduxState): string => state.views.createHunch.wager;
