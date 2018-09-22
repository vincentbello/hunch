import axios from 'axios';

import store from '../store';

const axiosInstance = axios.create({
  // baseUrl: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  config => {
    config.headers['x-auth-token'] = store.getState().session.accessToken;
    return config;
  }, Promise.reject
);

export default axiosInstance;
