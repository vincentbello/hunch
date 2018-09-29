// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { FETCH_BET } from 'actions/bets';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';

type ReduxState = PromiseState<>;

const initialState = { ...initialPromiseState };

export default function betCardReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case FETCH_BET:
      return handlePromise(state, action, { parseData: (data: Bet) => null });

    default:
      return state;
  }
}
