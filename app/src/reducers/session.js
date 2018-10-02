// @flow
import { handle } from 'redux-pack';

import { AUTHENTICATE, LOG_OUT, REFRESH_AUTH } from 'actions/user';

import { type Action } from 'types/redux';

export type ReduxState = {
  accessToken: null | string,
  refreshToken: null | string,
}

const initialState = {
  accessToken: null,
  refreshToken: null,
};

export default function sessionReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case AUTHENTICATE:
    case REFRESH_AUTH:
      return handle(state, action, {
        success: (prevState: ReduxState): ReduxState => ({
          ...state,
          accessToken: action.payload.headers['x-auth-token'],
          refreshToken: action.payload.headers['r-auth-token'],
        }),
      });

    case LOG_OUT:
      return handle(state, action, {
        success: (): ReduxState => ({ ...initialState }),
      });

    default:
      return state;
  }
}
