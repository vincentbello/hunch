// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { FETCH_BETS } from 'actions/bets';
import { idsToList } from 'utils/normalization';

import { type BetEntities } from 'types/entities';
import { type Action, type PromiseState } from 'types/redux';

type ReduxState = {
  active: PromiseState<Array<number>>,
};

const initialState = {
  active: { ...initialPromiseState },
}

export default function betListsReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case FETCH_BETS:
      return handlePromise(state, action, { rootPath: action.meta.listType, cacheData: true });

    default:
      return state;
  }
}
