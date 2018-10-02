import axios from 'axios';

export default store => next => action => {
  if (typeof action.promiseFn === 'function') {
    const { accessToken } = store.getState().session;

    if (accessToken !== null) {
      axios.interceptors.request.use(config => {
        config.headers['x-auth-token'] = accessToken;
        return config;
      }, Promise.reject);
      return next({ ...action, promise: action.promiseFn() })
    }
  }

  return next(action);
};
