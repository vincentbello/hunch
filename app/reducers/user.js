// @flow
import { handle } from 'redux-pack';
import handlePromise, { initialPromiseState } from 'utils/handlePromise';

import { AUTHENTICATE, LOG_OUT, REFRESH_AUTH } from 'actions/user';

import { type User } from 'types/user';
import { type Action, type PromiseState } from 'types/redux';

export type UserState = PromiseState & {
  data: User | null,
};

const initialState = {
  ...initialPromiseState,
};

export default function userReducer(state: UserState = initialState, action: Action): UserState {
  switch (action.type) {
    case AUTHENTICATE:
    case REFRESH_AUTH:
      return handlePromise(state, action);

    case LOG_OUT:
      return handle(state, action, {
        success: (): UserState => ({ ...initialState }),
      });

    default:
      return state;
  }
}
