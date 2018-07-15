// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';

import { AUTHENTICATE } from 'actions/user';

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
      return handlePromise(state, action);

    default:
      return state;
  }
}
