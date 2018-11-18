// @flow
import { createSelector } from 'reselect';
import { DATE_VIEW_TYPES } from 'constants/view-types';
import { type User } from 'types/user';
import { type ReduxState } from 'types/state';

export const getBetAmount = (state: ReduxState): number => state.views.createBet.amount;

export const getBettee = (state: ReduxState): User | null => state.views.createBet.bettee;

export const getBettorPickTeamId = (state: ReduxState): number | null => state.views.createBet.bettorPickTeamId;

export const getDateViewIndex = (state: ReduxState): number => state.views.createBet.dateViewIndex;

export const getDateViewType = createSelector(getDateViewIndex, (index: number): string => DATE_VIEW_TYPES[index].key);

export const getGameId = (state: ReduxState): number | null => state.views.createBet.gameId;

export const getBetWager = (state: ReduxState): string => state.views.createBet.wager;
