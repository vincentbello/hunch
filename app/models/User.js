// @flow
import axios from 'axios';
import { AsyncStorage } from 'react-native';

import { type User as UserPayload } from 'types/user';

export default class User {
  static authenticateWithFacebook(fbAccessToken: string): Promise<UserPayload> {
    return axios.post('http://localhost:3000/auth/facebook', { access_token: fbAccessToken });
  }

  static logOut(userId: number): Promise<> {
    return axios.post('http://localhost:3000/auth/revoke', { userId });
  }

  static refreshAuth(refreshToken: string): Promise<UserPayload> {
    return axios.post('http://localhost:3000/auth/refresh', { refreshToken });
  }
}
