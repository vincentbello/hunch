// @flow
import axios from 'axios';
import { stringify } from 'qs';
import { AsyncStorage } from 'react-native';

import { type Os } from 'types/device';
import { type Bet } from 'types/bet';
import { type Game } from 'types/game';
import { type User as UserPayload, type UserGroupType } from 'types/user';

const API_URL = 'http://vincents-macbook-pro.local:3000'; // 'http://localhost:3000';

export default class Api {
  static authenticateWithFacebook(fbAccessToken: string): Promise<UserPayload> {
    return axios.post(`${API_URL}/auth/facebook`, { access_token: fbAccessToken });
  }

  static logOut(userId: number): Promise<> {
    return axios.post(`${API_URL}/auth/revoke`, { userId });
  }

  static refreshAuth(refreshToken: string): Promise<UserPayload> {
    return axios.post(`${API_URL}/auth/refresh`, { refreshToken });
  }

  static registerDevice(os: Os, token: string): Promise<> {
    return axios.post(`${API_URL}/auth/device`, { os, token });
  }

  static cancelBetRequest(betId: number): Promise<> {
    return axios.delete(`${API_URL}/bets/${betId}`);
  }

  static createBet(betteeId: number, amount: number, gameId: number, bettorPickTeamId: number): Promise<Bet> {
    return axios.post(`${API_URL}/bets`, { betteeId, amount, gameId, bettorPickTeamId });
  }

  static fetchBet(betId: number): Promise<Bet> {
    return axios.get(`${API_URL}/bets/${betId}`);
  }

  static fetchBets(type: string): Promise<Array<Bet>> {
    return axios.get(`${API_URL}/bets?${stringify({ type })}`);
  }

  static remindBetRequest(betId: number): Promise<Bet> {
    return axios.patch(`${API_URL}/bets/${betId}/remind`);
  }

  static respondToBet(betId: number, accepted: boolean): Promise<Bet> {
    return axios.patch(`${API_URL}/bets/${betId}/response`, { accepted });
  }

  static fetchUpcomingGames(league: string, date: string): Promise<Array<Game>> {
    return axios.get(`${API_URL}/games/upcoming?${stringify({ league, date })}`)
  }

  static fetchUsers(type: UserGroupType): Promise<Array<UserPayload>> {
    return axios.get(`${API_URL}/users?${stringify({ type })}`);
  }
}
