// @flow
import Api from 'api';

import { type ViewType } from 'types/bet';
import { type Action } from 'types/redux';

export const CANCEL_REQUEST = 'BETS/CANCEL_REQUEST';
export const FETCH_BET = 'BETS/FETCH_BET';
export const FETCH_BETS = 'BETS/FETCH_BETS';
export const REMIND = 'BETS/REMIND';
export const RESPOND_TO_BET = 'BETS/RESPOND_TO_BET';
export const SET_VIEW_INDEX = 'BETS/SET_VIEW_INDEX';

export const cancelRequest = (betId: number, index: number): Action => ({
  type: CANCEL_REQUEST,
  promiseFn: () => Api.cancelBetRequest(betId),
  meta: { betId, index },
});

export const fetchBet = (betId: number): Action => ({
  type: FETCH_BET,
  promiseFn: () => Api.fetchBet(betId),
});

export const fetchBets = (viewType: ViewType = 'active'): Action => ({
  type: FETCH_BETS,
  promiseFn: () => Api.fetchBets(viewType),
  meta: { viewType },
});

export const remind = (betId: number): Action => ({
  type: REMIND,
  promiseFn: () => Api.remindBetRequest(betId),
  meta: { betId },
});

export const respondToBet = (betId: number, betIndex: number, accepted: boolean = false): Action => ({
  type: RESPOND_TO_BET,
  promiseFn: () => Api.respondToBet(betId, accepted),
  meta: { betId, betIndex },
})

export const setViewIndex = (viewIndex: number): Action => ({ type: SET_VIEW_INDEX, payload: { viewIndex } });
