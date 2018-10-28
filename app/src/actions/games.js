// @flow
import Api from 'api';

import { type Action } from 'types/redux';

export const FETCH_UPCOMING_GAMES = 'GAMES/FETCH_UPCOMING_GAMES';

export const fetchUpcomingGames = (league: string, date: string): Action => ({
  type: FETCH_UPCOMING_GAMES,
  promiseFn: () => Api.fetchUpcomingGames(league, date),
  meta: { date },
});
