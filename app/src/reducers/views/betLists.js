// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { FETCH_BETS } from 'actions/bets';
import { toList } from 'utils/normalization';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';

export type ReduxState = {
  active: PromiseState<Array<number>>,
};

const initialState = {
  active: { ...initialPromiseState },
}

export default function betListsReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case FETCH_BETS:
      return handlePromise(state, action, {
        rootPath: action.meta.listType,
        cacheData: true,
        parseData: (data: Array<Bet>): Array<number> => toList(data),
      });

    default:
      return state;
  }
}
