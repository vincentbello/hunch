// @flow
import { Actions } from 'react-native-router-flux';
import Api from 'api';

import { type Action } from 'types/redux';
import { type User } from 'types/user';

export const CREATE_BET = 'CREATE_BET/CREATE_BET';
export const SET_BET_AMOUNT = 'CREATE_BET/SET_BET_AMOUNT';
export const SET_BETTEE = 'CREATE_BET/SET_BETTEE';
export const SET_BETTOR_PICK_TEAM = 'CREATE_BET/SET_BETTOR_PICK_TEAM';
export const SET_DATE_VIEW_INDEX = 'CREATE_BET/SET_DATE_VIEW_INDEX';
export const SET_GAME = 'CREATE_BET/SET_GAME';

export const createBet = (betteeId: number, amount: number, gameId: number, bettorPickTeamId: number): Action => ({
  type: CREATE_BET,
  promiseFn: () => Api.createBet(betteeId, amount, gameId, bettorPickTeamId),
  meta: { onSuccess: Actions.pop },
});

export const setBetAmount = (amount: number): Action => ({ type: SET_BET_AMOUNT, payload: { amount } });
export const setBettee = (bettee: User | null): Action => ({ type: SET_BETTEE, payload: { bettee } });
export const setBettorPickTeam = (bettorPickTeamId: number | null): Action => ({ type: SET_BETTOR_PICK_TEAM, payload: { bettorPickTeamId } })
export const setDateViewIndex = (dateViewIndex: number): Action => ({ type: SET_DATE_VIEW_INDEX, payload: { dateViewIndex } });
export const setGame = (gameId: number | null): Action => ({ type: SET_GAME, payload: { gameId } });
