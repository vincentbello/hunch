// @flow
import { type Action } from 'types/redux';
import { type User } from 'types/user';

export const CLEAR_FORM = 'CREATE_BET/CLEAR_FORM';
export const SET_BET_AMOUNT = 'CREATE_BET/SET_BET_AMOUNT';
export const SET_BETTEE = 'CREATE_BET/SET_BETTEE';
export const SET_BETTOR_PICK_TEAM = 'CREATE_BET/SET_BETTOR_PICK_TEAM';
export const SET_DATE_VIEW_INDEX = 'CREATE_BET/SET_DATE_VIEW_INDEX';
export const SET_GAME = 'CREATE_BET/SET_GAME';

export const clearForm = (): Action => ({ type: CLEAR_FORM });
export const setBetAmount = (amount: number): Action => ({ type: SET_BET_AMOUNT, payload: { amount } });
export const setBettee = (bettee: User | null): Action => ({ type: SET_BETTEE, payload: { bettee } });
export const setBettorPickTeam = (id: number | null): Action => ({ type: SET_BETTOR_PICK_TEAM, payload: { bettorPickTeamId: id } });
export const setDateViewIndex = (dateViewIndex: number): Action => ({ type: SET_DATE_VIEW_INDEX, payload: { dateViewIndex } });
export const setGame = (gameId: number | null): Action => ({ type: SET_GAME, payload: { gameId } });
