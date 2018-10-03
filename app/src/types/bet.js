// @flow
import { type Game } from 'types/game';
import { type Team } from 'types/team';
import { type User } from 'types/user';

export type Bet = {
  id: number,
  responded: boolean,
  accepted: boolean,
  active: boolean,
  amount: number,
  resolvedAt: string,
  type: 'MONEY_LINE',
  wager: string,
  createdAt: string,
  bettorId: number,
  betteeId: number,
  gameId: number,
  bettorPickTeamId: number,
  bettor: User,
  bettee: User,
  game: Game,
  bettorPickTeam: Team,
};
