// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { FETCH_BET } from 'actions/bets';
import { SET_BETTEE } from 'actions/createBet';
import { FETCH_USERS } from 'actions/users';
import { toList } from 'utils/normalization';

import { type User } from 'types/user';
import { type Action, type PromiseState } from 'types/redux';

type ReduxState = {
  betteeId: number | null,
  users: PromiseState<Array<number>>,
};

const initialState = {
  betteeId: null,
  users: { ...initialPromiseState },
};

export default function createBetReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case FETCH_USERS:
      return handlePromise(state, action, {
        rootPath: 'users',
        cacheData: true,
        parseData: (data: Array<User>): Array<number> => toList(data),
      });

    case SET_BETTEE:
      return { ...state, betteeId: action.payload.betteeId };

    default:
      return state;
  }
}
