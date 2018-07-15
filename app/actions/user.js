// @flow
import User from 'models/User';

import { type Action } from 'types/redux';

export const AUTHENTICATE = 'USER/AUTHENTICATE';

export const authenticateWithFacebook = (fbAccessToken: string): Action => ({
  type: AUTHENTICATE,
  promise: User.authenticateWithFacebook(fbAccessToken),
});
