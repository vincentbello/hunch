// @flow
import { type Bet } from 'types/bet';
import { type User } from 'types/user';

export type BetEntities = {
  [betId: number]: Bet,
};

export type UserEntities = {
  [userId: number]: User,
};

export type Entities = {
  bets: BetEntities,
  users: UserEntities,
};
