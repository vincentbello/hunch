// @flow
import { handle } from 'redux-pack';
import handlePromise, { initialPromiseState } from 'utils/handlePromise';

import { AUTHENTICATE, LOG_OUT, REFRESH_AUTH } from 'actions/user';

import { type User } from 'types/user';
import { type Action, type PromiseState } from 'types/redux';

export type ReduxState = PromiseState<User>;

const initialState = {
  ...initialPromiseState,
};

export default function userReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case AUTHENTICATE:
    case REFRESH_AUTH:
      return handlePromise(state, action, { cacheData: true });

    case LOG_OUT:
      return handle(state, action, {
        success: (): ReduxState => ({ ...initialState }),
      });

    default:
      return state;
  }
}
