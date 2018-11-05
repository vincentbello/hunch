// @flow
import axios from 'axios';
import { API_URL } from 'react-native-dotenv';

import { type Os } from 'types/device';
import { type Bet } from 'types/bet';
import { type User as UserPayload } from 'types/user';

export default class Api {
  // TODO
  static authenticateWithFacebook(fbAccessToken: string): Promise<UserPayload> {
    return axios.post(`${API_URL}/auth/facebook`, { access_token: fbAccessToken });
  }

  // TODO
  static logOut(userId: number): Promise<> {
    return axios.post(`${API_URL}/auth/revoke`, { userId });
  }

  // TODO
  static refreshAuth(refreshToken: string): Promise<UserPayload> {
    return axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  }

  // TODO
  static registerDevice(os: Os, token: string): Promise<> {
    return axios.post(`${API_URL}/auth/device`, { os, token });
  }
}
