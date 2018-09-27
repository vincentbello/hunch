// @flow
import Api from 'api';

import { type Action } from 'types/redux';

export const FETCH_BETS = 'BETS/FETCH_BETS';

export const fetchBets = (listType: 'active' = 'active'): Action => ({
  type: FETCH_BETS,
  promiseFn: () => Api.fetchBets(listType),
  meta: { listType },
});
