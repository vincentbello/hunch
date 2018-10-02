// @flow
import { type Bet } from 'types/bet';
import { type Game } from 'types/game';
import { type Team } from 'types/team';
import { type User } from 'types/user';

export type BetEntities = {
  [betId: number]: Bet,
};

export type GameEntities = {
  [gameId: number]: Game,
};

export type TeamEntities = {
  [teamId: number]: Team,
};

export type UserEntities = {
  [userId: number]: User,
};

export type Entities = {
  bets: BetEntities,
  games: GameEntities,
  teams: TeamEntities,
  users: UserEntities,
};
