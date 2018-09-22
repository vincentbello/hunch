// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';

import { AUTHENTICATE, REFRESH_AUTH } from 'actions/user';

import { type User } from 'types/user';
import { type Action, type PromiseState } from 'types/redux';

export type UserState = PromiseState & {
  data: User | null,
};

const initialState = {
  ...initialPromiseState,
};

export default function userReducer(state: UserState = initialState, action: Action): UserState {
  console.log('~ACTION~', AUTHENTICATE, REFRESH_AUTH);
  switch (action.type) {
    case AUTHENTICATE:
    case REFRESH_AUTH:
      return handlePromise(state, action);

    default:
      return state;
  }
}
