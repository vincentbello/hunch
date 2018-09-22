// @flow
import { handle } from 'redux-pack';

import { AUTHENTICATE, LOG_OUT, REFRESH } from 'actions/user';

import { type Action } from 'types/redux';

export type SessionState = {
  accessToken: null | string,
  refreshToken: null | string,
}

const initialState = {
  accessToken: null,
  refreshToken: null,
};

export default function sessionReducer(state: SessionState = initialState, action: Action): SessionState {
  switch (action.type) {
    case AUTHENTICATE:
    case REFRESH:
      return handle(state, action, {
        success: (prevState: SessionState): SessionState => ({
          ...state,
          accessToken: action.payload.headers['x-auth-token'],
          refreshToken: action.payload.headers['r-auth-token'],
        }),
      });

    case LOG_OUT:
      return handle(state, action, {
        success: (): SessionState => ({ ...initialState }),
      });

    default:
      return state;
  }
}
