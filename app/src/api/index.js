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

  static registerDevice(deviceToken: string): Promise<> {
    return axios.post('http://localhost:3000/auth/device', { deviceToken });
  }

  static cancelBetRequest(betId: number): Promise<> {
    return axios.delete(`http://localhost:3000/bets/${betId}`);
  }

  static createBet(betteeId: number, amount: number, gameId: number, bettorPickTeamId: number): Promise<Bet> {
    return axios.post(`http://localhost:3000/bets`, { betteeId, amount, gameId, bettorPickTeamId });
  }

  static fetchBet(betId: number): Promise<Bet> {
    return axios.get(`http://localhost:3000/bets/${betId}`);
  }

  static fetchBets(type: string): Promise<Array<Bet>> {
    return axios.get(`http://localhost:3000/bets?${stringify({ type })}`);
  }

  static remindBetRequest(betId: number): Promise<Bet> {
    return axios.patch(`http://localhost:3000/bets/${betId}/remind`);
  }

  static respondToBet(betId: number, accepted: boolean): Promise<Bet> {
    return axios.patch(`http://localhost:3000/bets/${betId}/response`, { accepted });
  }

  static fetchUpcomingGames(league: string, date: string): Promise<Array<Game>> {
    return axios.get(`http://localhost:3000/games/upcoming?${stringify({ league, date })}`)
  }

  static fetchUsers(type: UserGroupType): Promise<Array<UserPayload>> {
    return axios.get(`http://localhost:3000/users?${stringify({ type })}`);
  }
}
