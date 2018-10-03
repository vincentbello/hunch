// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { FETCH_BET } from 'actions/bets';
import { FETCH_GAMES } from 'actions/games';
import { SET_BET_AMOUNT, SET_BETTEE, SET_BETTOR_PICK_TEAM, SET_GAME } from 'actions/createBet';
import { FETCH_USERS } from 'actions/users';
import { toList } from 'utils/normalization';

import { type Game } from 'types/game';
import { type User } from 'types/user';
import { type Action, type PromiseState } from 'types/redux';

export type ReduxState = {
  amount: number,
  bettorPickId: number | null,
  betteeId: number | null,
  gameId: number | null,
  games: PromiseState<Array<number>>,
  users: PromiseState<Array<number>>,
};

const initialState = {
  amount: 0,
  bettorPickId: null,
  betteeId: null,
  gameId: null,
  games: { ...initialPromiseState },
  users: { ...initialPromiseState },
};

export default function createBetReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case FETCH_GAMES:
      return handlePromise(state, action, {
        rootPath: 'games',
        cacheData: true,
        parseData: (data: Array<Game>): Array<number> => toList(data),
      });

    case FETCH_USERS:
      return handlePromise(state, action, {
        rootPath: 'users',
        cacheData: true,
        parseData: (data: Array<User>): Array<number> => toList(data),
      });

    case SET_BET_AMOUNT:
      return { ...state, amount: action.payload.amount };

    case SET_BETTEE:
      return { ...state, betteeId: action.payload.betteeId };

    case SET_BETTOR_PICK_TEAM:
      return { ...state, amount: action.payload.bettorPickTeamId };

    case SET_GAME:
      return { ...state, gameId: action.payload.gameId };

    default:
      return state;
  }
}
