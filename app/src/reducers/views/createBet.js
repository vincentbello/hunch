// @flow
import handlePromise, { initialPromiseState } from 'utils/handlePromise';
import { FETCH_BET } from 'actions/bets';
import { FETCH_UPCOMING_GAMES } from 'actions/games';
import { CREATE_BET, SET_BET_AMOUNT, SET_BETTEE, SET_BETTOR_PICK_TEAM, SET_DATE_VIEW_INDEX, SET_GAME } from 'actions/createBet';
import { DATE_VIEW_TYPES } from 'constants/view-types';
import { toList } from 'utils/normalization';

import { type Game } from 'types/game';
import { type User } from 'types/user';
import { type Action, type PromiseState } from 'types/redux';

export type ReduxState = {
  amount: number,
  bettorPickTeamId: number | null,
  bettee: User | null,
  creation: PromiseState<>,
  gameId: number | null,
  games: {
    [dateKey: string]: PromiseState<Array<number>>,
  },
  dateViewIndex: number,
};

const initialState = {
  amount: 0,
  bettorPickTeamId: null,
  bettee: null,
  creation: { ...initialPromiseState },
  gameId: null,
  games: DATE_VIEW_TYPES.reduce((types, type) => ({ ...types, [type.key]: { ...initialPromiseState } }), {}),
  dateViewIndex: 0,
};

export default function createBetReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case CREATE_BET:
      return handlePromise(state, action, {
        rootPath: 'creation',
        handleSuccess: (prevState: ReduxState): ReduxState => ({ ...initialState }),
      });

    case FETCH_UPCOMING_GAMES:
      return handlePromise(state, action, {
        rootPath: `games.${action.meta.date}`,
        cacheData: true,
        parseData: (data: Array<Game>): Array<number> => toList(data),
      });

    case SET_BET_AMOUNT:
      return { ...state, amount: action.payload.amount };

    case SET_BETTEE:
      return { ...state, bettee: action.payload.bettee };

    case SET_BETTOR_PICK_TEAM:
      return { ...state, bettorPickTeamId: action.payload.bettorPickTeamId };

    case SET_DATE_VIEW_INDEX:
      return { ...state, dateViewIndex: action.payload.dateViewIndex };

    case SET_GAME:
      return { ...state, gameId: action.payload.gameId, bettorPickTeamId: initialState.bettorPickTeamId };

    default:
      return state;
  }
}
