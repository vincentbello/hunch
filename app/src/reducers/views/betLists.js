// @flow
import dotProp from 'dot-prop-immutable';
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { FETCH_BETS, RESPOND_TO_BET } from 'actions/bets';
import { toList } from 'utils/normalization';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';

export type ReduxState = {
  active: PromiseState<Array<number>>,
  requested: PromiseState<Array<number>>,
  response: PromiseState<>,
};

const initialState = {
  active: { ...initialPromiseState },
  requested: { ...initialPromiseState },
  response: { ...initialPromiseState },
}

export default function betListsReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case FETCH_BETS:
      return handlePromise(state, action, {
        rootPath: action.meta.listType,
        cacheData: true,
        parseData: (data: Array<Bet>): Array<number> => toList(data),
      });

    case RESPOND_TO_BET:
      return handlePromise(state, action, {
        meta: { betId: action.meta.betId },
        rootPath: 'response',
        parseData: (data: Bet): null => null,
      });

    default:
      return state;
  }
}
