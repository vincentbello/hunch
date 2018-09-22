// @flow
import User from 'models/User';

import { type Action } from 'types/redux';

export const AUTHENTICATE = 'USER/AUTHENTICATE';
export const LOG_OUT = 'USER/LOG_OUT';
export const REFRESH_AUTH = 'USER/REFRESH_AUTH';

export const authenticate = (fbAccessToken: string): Action => ({
  type: AUTHENTICATE,
  promise: User.authenticateWithFacebook(fbAccessToken),
});

export const logOut = (userId: number): Action => ({ type: LOG_OUT, promiseFn: () => User.logOut(userId) });

export const refreshAuth = (refreshToken: string): Action => ({
  type: REFRESH_AUTH,
  promiseFn: () => User.refreshAuth(refreshToken),
});
