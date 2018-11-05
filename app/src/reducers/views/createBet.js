// @flow
import { CLEAR_FORM, SET_BET_AMOUNT, SET_BETTEE, SET_BETTOR_PICK_TEAM, SET_DATE_VIEW_INDEX, SET_GAME } from 'actions/createBet';

import { type User } from 'types/user';
import { type Action } from 'types/redux';

export type ReduxState = {
  amount: number,
  bettorPickTeamId: number | null,
  bettee: User | null,
  gameId: number | null,
  dateViewIndex: number,
};

const initialState = {
  amount: 0,
  bettorPickTeamId: null,
  bettee: null,
  gameId: null,
  dateViewIndex: 0,
};

export default function createBetReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case CLEAR_FORM:
      return { ...initialState };

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
