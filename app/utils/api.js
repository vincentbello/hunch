import axios from 'axios';

import { AsyncStorage } from 'react-native';

const axiosInstance = axios.create({
  // baseUrl: 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  async config => {
    config.headers['x-auth-token'] = await AsyncStorage.getItem('AUTH_TOKEN');
    return config;
  }, Promise.reject
);

export default axiosInstance;
