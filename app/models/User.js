// @flow
import axios from 'axios';
import api from 'utils/api';
import { AsyncStorage } from 'react-native';

import { type User as UserPayload } from 'types/user';

export default class User {
  static authenticateWithFacebook(fbAccessToken: string): Promise<UserPayload> {
    return axios.post('http://localhost:3000/auth/facebook', { access_token: fbAccessToken });
  }

  static refresh(refreshToken: string, userId: number) {
    return api.post('http://localhost:3000/auth/refresh', { refreshToken, userId });
  }
}
