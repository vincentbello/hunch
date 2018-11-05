// @flow
import { type Bet } from 'types/bet';
import { type Game } from 'types/game';
import { type Team } from 'types/team';
import { type User } from 'types/user';

type Entities<T> = {
  [id: number]: T,
};

export type BetEntities = Entities<Bet>;
export type GameEntities = Entities<Game>;
export type TeamEntities = Entities<Team>;
export type UserEntities = Entities<User>;
