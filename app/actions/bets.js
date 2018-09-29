// @flow
import Api from 'api';

import { type Action } from 'types/redux';

export const FETCH_BET = 'BETS/FETCH_BET';
export const FETCH_BETS = 'BETS/FETCH_BETS';

export const fetchBet = (betId: number): Action => ({
  type: FETCH_BET,
  promiseFn: () => Api.fetchBet(betId),
});

export const fetchBets = (listType: 'active' = 'active'): Action => ({
  type: FETCH_BETS,
  promiseFn: () => Api.fetchBets(listType),
  meta: { listType },
});
