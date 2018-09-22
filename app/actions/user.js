// @flow
import User from 'models/User';

import { type Action } from 'types/redux';

export const AUTHENTICATE = 'USER/AUTHENTICATE';
export const REFRESH_AUTH = 'USER/REFRESH_AUTH';

export const authenticate = (fbAccessToken: string): Action => ({
  type: AUTHENTICATE,
  promise: User.authenticateWithFacebook(fbAccessToken),
});

export const refresh = (refreshToken: string, userId: number): Action => ({
  type: REFRESH_AUTH,
  promise: User.refresh(refreshToken, userId),
});
