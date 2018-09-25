// @flow
import User from 'models/User';

import { type Action } from 'types/redux';

export const AUTHENTICATE = 'USER/AUTHENTICATE';
export const LOG_OUT = 'USER/LOG_OUT';
export const REFRESH_AUTH = 'USER/REFRESH_AUTH';

let sessionTimeout = null;

const clearSessionTimeout = () => clearTimeout(sessionTimeout);
const setSessionTimeout = (dispatch, getState) => {
  clearTimeout(sessionTimeout);
  sessionTimeout = setTimeout(() => {
    const { session } = getState();
    if (session.refreshToken !== null) dispatch(refreshAuth(session.refreshToken));
  }, 60 * 115 * 1000);
};

export const authenticate = (fbAccessToken: string): Action => {
  return (dispatch, getState) => dispatch({
    type: AUTHENTICATE,
    promise: User.authenticateWithFacebook(fbAccessToken),
    onSuccess: () => setSessionTimeout(dispatch, getState),
  });
};

export const logOut = (userId: number): Action => ({ type: LOG_OUT, promiseFn: () => User.logOut(userId), onSuccess: clearSessionTimeout });

export const refreshAuth = (refreshToken: string): Action => {
  return (dispatch, getState) => dispatch({
    type: REFRESH_AUTH,
    promiseFn: () => User.refreshAuth(refreshToken),
    onSuccess: () => setSessionTimeout(dispatch, getState),
  });
};
