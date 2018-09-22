// @flow
import { handle } from 'redux-pack';

import { AUTHENTICATE, REFRESH } from 'actions/user';

import { type Action } from 'types/redux';

export type SessionState = {
  accessToken: null | string,
  refreshToken: null | string,
}

const initialState = {
  accessToken: null,
  refreshToken: null,
};

export default function userReducer(state: SessionState = initialState, action: Action): SessionState {
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

    default:
      return state;
  }
}
