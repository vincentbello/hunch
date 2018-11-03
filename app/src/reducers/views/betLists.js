// @flow
import { handle } from 'redux-pack';
import dotProp from 'dot-prop-immutable';
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { CANCEL_REQUEST, FETCH_BETS, RESPOND_TO_BET, SET_VIEW_INDEX } from 'actions/bets';
import { toList } from 'utils/normalization';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';

export type ReduxState = {
  active: PromiseState<Array<number>>,
  completed: PromiseState<Array<number>>,
  requested: PromiseState<Array<number>>,
  cancellation: PromiseState<>,
  response: PromiseState<>,
  viewIndex: number,
};

const initialState = {
  active: { ...initialPromiseState },
  completed: { ...initialPromiseState },
  pending: { ...initialPromiseState },
  requested: { ...initialPromiseState },
  cancellation: { ...initialPromiseState },
  response: { ...initialPromiseState },
  viewIndex: 0,
}

export default function betListsReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case CANCEL_REQUEST:
      return handlePromise(state, action, {
        meta: { betId: action.meta.betId },
        rootPath: 'cancellation',
        handleSuccess: (prevState: ReduxState): ReduxState => dotProp.delete(prevState, `pending.${action.meta.index}`),
      });

    case FETCH_BETS:
      return handlePromise(state, action, {
        rootPath: action.meta.betListType,
        cacheData: true,
        parseData: (data: Array<Bet>): Array<number> => toList(data),
      });

    case RESPOND_TO_BET:
      return handlePromise(state, action, {
        meta: { betId: action.meta.betId },
        rootPath: 'response',
        handleSuccess: (prevState: ReduxState): ReduxState => dotProp.delete(prevState, `requested.data.${action.meta.betIndex}`),
      });

    case SET_VIEW_INDEX:
      return { ...state, viewIndex: action.payload.viewIndex };

    default:
      return state;
  }
}
