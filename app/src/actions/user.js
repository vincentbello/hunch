// @flow
import { Actions } from 'react-native-router-flux';
import Api from 'api';

import { type Action } from 'types/redux';

export const AUTHENTICATE = 'USER/AUTHENTICATE';
export const LOG_OUT = 'USER/LOG_OUT';
export const REFRESH_AUTH = 'USER/REFRESH_AUTH';
export const REGISTER_DEVICE = 'USER/REGISTER_DEVICE';

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
    promise: Api.authenticateWithFacebook(fbAccessToken),
    meta: { onSuccess: () => setSessionTimeout(dispatch, getState) },
  });
};

export const logOut = (userId: number): Action => ({
  type: LOG_OUT,
  promiseFn: () => Api.logOut(userId),
  meta: {
    onSuccess: () => {
      clearSessionTimeout();
      Actions.loginModal();
    },
  },
});

export const refreshAuth = (refreshToken: string): Action => {
  return (dispatch, getState) => dispatch({
    type: REFRESH_AUTH,
    promiseFn: () => Api.refreshAuth(refreshToken),
    meta: { onSuccess: () => setSessionTimeout(dispatch, getState) },
  });
};

export const registerDevice = (deviceToken: string): Action => ({
  type: REGISTER_DEVICE,
  promiseFn: () => Api.registerDevice(deviceToken),
});
