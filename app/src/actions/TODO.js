// // @flow
// import { Actions } from 'react-native-router-flux';

// import { type Os } from 'types/device';
// import { type Action } from 'types/redux';

// export const AUTHENTICATE = 'USER/AUTHENTICATE';
// export const LOG_OUT = 'USER/LOG_OUT';
// export const REFRESH_AUTH = 'USER/REFRESH_AUTH';
// export const REGISTER_DEVICE = 'USER/REGISTER_DEVICE';

// let sessionTimeout = null;

// const clearSessionTimeout = () => clearTimeout(sessionTimeout);
// const setSessionTimeout = (dispatch, getState) => {
//   clearTimeout(sessionTimeout);
//   sessionTimeout = setTimeout(() => {
//     const { session } = getState();
//     if (session.refreshToken !== null) dispatch(refreshAuth(session.refreshToken));
//   }, 60 * 115 * 1000);
// };
