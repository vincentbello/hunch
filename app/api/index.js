// @flow
import axios from 'axios';
import { stringify } from 'qs';
import { AsyncStorage } from 'react-native';

import { type Bet } from 'types/bet';
import { type Game } from 'types/game';
import { type User as UserPayload, type UserGroupType } from 'types/user';

export default class Api {
  static authenticateWithFacebook(fbAccessToken: string): Promise<UserPayload> {
    return axios.post('http://localhost:3000/auth/facebook', { access_token: fbAccessToken });
  }

  static logOut(userId: number): Promise<> {
    return axios.post('http://localhost:3000/auth/revoke', { userId });
  }

  static refreshAuth(refreshToken: string): Promise<UserPayload> {
    return axios.post('http://localhost:3000/auth/refresh', { refreshToken });
  }

  static fetchBet(betId: number): Promise<Bet> {
    return axios.get(`http://localhost:3000/bets/${betId}`);
  }

  static fetchBets(type: string): Promise<Array<Bet>> {
    return axios.get(`http://localhost:3000/bets?${stringify({ type })}`);
  }

  static fetchGames(league: string, type: string): Promise<Array<Game>> {
    return axios.get(`http://localhost:3000/games?${stringify({ league, type })}`)
  }

  static fetchUsers(type: UserGroupType): Promise<Array<UserPayload>> {
    return axios.get(`http://localhost:3000/users?${stringify({ type })}`);
  }
}
