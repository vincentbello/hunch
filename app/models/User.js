// @flow
import axios from 'axios';
import api from 'utils/api';
import { AsyncStorage } from 'react-native';

import { type User as UserPayload } from 'types/user';

export default class User {
  static authenticateWithFacebook(fbAccessToken: string): Promise<UserPayload> {
    return axios.post('http://localhost:3000/auth/facebook', { access_token: fbAccessToken })
      .then(response => {
        console.log('RESPONSE <><><>', response);
        return AsyncStorage.setItem('AUTH_TOKEN', response.headers['x-auth-token']);
      });
  }

  static fetchMe() {
    return api.get('http://localhost:3000/auth/me');
    // return api.get('/auth/me');
  }
}
