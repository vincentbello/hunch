// @flow
import { type Team } from 'types/team';

export type Game = {
  id: number,
  league: string,
  season: number,
  seasonType: string,
  completed: boolean,
  inProgress: boolean,
  homeScore: number | null,
  awayScore: number | null,
  week: number,
  startDate: string,
  homeTeam: Team,
  awayTeam: Team,
};
