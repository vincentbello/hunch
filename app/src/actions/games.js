// @flow
import Api from 'api';

import { type Action } from 'types/redux';

export const FETCH_GAMES = 'GAMES/FETCH_GAMES';

export const fetchGames = (league: string, type: 'upcoming' = 'upcoming'): Action => ({
  type: FETCH_GAMES,
  promiseFn: () => Api.fetchGames(league, type),
});
