// @flow
import { type Action } from 'types/redux';

export const SET_BET_AMOUNT = 'CREATE_BET/SET_BET_AMOUNT';
export const SET_BETTEE = 'CREATE_BET/SET_BETTEE';
export const SET_BETTOR_PICK_TEAM = 'CREATE_BET/SET_BETTOR_PICK_TEAM';
export const SET_GAME = 'CREATE_BET/SET_GAME';

export const setBetAmount = (amount: number): Action => ({ type: SET_BET_AMOUNT, payload: { amount } });
export const setBettee = (betteeId: number | null): Action => ({ type: SET_BETTEE, payload: { betteeId } });
export const setBettorPickTeam = (bettorPickTeamId: number | null): Action => ({ type: SET_BETTOR_PICK_TEAM, payload: { bettorPickTeamId } })
export const setGame = (gameId: number | null): Action => ({ type: SET_GAME, payload: { gameId } });
