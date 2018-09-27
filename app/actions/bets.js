// @flow
import Api from 'api';
import User from 'models/User';

import { type Action } from 'types/redux';

export const FETCH_BETS = 'BETS/FETCH_BETS';

export const fetchBets = (listType: 'active'): Action => ({
  type: FETCH_BETS,
  promiseFn: () => Api.fetchBets(),
  meta: { listType },
});
