// @flow
import User from 'models/User';

import { type Action } from 'types/redux';

export const AUTHENTICATE = 'USER/AUTHENTICATE';
export const FETCH_ME = 'USER/FETCH_ME';

export const authenticate = (fbAccessToken: string): Action => ({
  type: AUTHENTICATE,
  promise: User.authenticateWithFacebook(fbAccessToken),
});

export const fetchMe = (): Action => ({ type: FETCH_ME, promise: User.fetchMe(), onSuccess: console.log });
