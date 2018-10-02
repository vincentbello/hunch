// @flow
import { type Team } from 'types/team';

export type Game = {
  id: number,
  league: string,
  season: number,
  seasonType: string,
  completed: boolean,
  homeScore: number,
  awayScore: number,
  week: number,
  startDate: string,
  homeTeam: Team,
  awayTeam: Team,
};
