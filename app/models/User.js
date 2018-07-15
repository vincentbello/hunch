// @flow
import axios from 'axios';

import { type User as UserPayload } from 'types/user';

export default class User {
  static authenticateWithFacebook(fbAccessToken: string): Promise<UserPayload> {
    return axios.post('/api/users/facebook_auth', { token: fbAccessToken });
  }
}
