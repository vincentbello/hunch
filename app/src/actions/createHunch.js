// @flow
import { type Action } from 'types/redux';
import { type User } from 'types/user';

export const CLEAR_FORM = 'CREATE_HUNCH/CLEAR_FORM';
export const SET_HUNCH_AMOUNT = 'CREATE_HUNCH/SET_HUNCH_AMOUNT';
export const SET_BETTEE = 'CREATE_HUNCH/SET_BETTEE';
export const SET_BETTOR_PICK_TEAM = 'CREATE_HUNCH/SET_BETTOR_PICK_TEAM';
export const SET_DATE_VIEW_INDEX = 'CREATE_HUNCH/SET_DATE_VIEW_INDEX';
export const SET_GAME = 'CREATE_HUNCH/SET_GAME';
export const SET_WAGER = 'CREATE_HUNCH/SET_WAGER';

export const clearForm = (): Action => ({ type: CLEAR_FORM });
export const setHunchAmount = (amount: number): Action => ({ type: SET_HUNCH_AMOUNT, payload: { amount } });
export const setBettee = (bettee: User | null): Action => ({ type: SET_BETTEE, payload: { bettee } });
export const setBettorPickTeam = (id: number | null): Action => ({ type: SET_BETTOR_PICK_TEAM, payload: { bettorPickTeamId: id } });
export const setDateViewIndex = (dateViewIndex: number): Action => ({ type: SET_DATE_VIEW_INDEX, payload: { dateViewIndex } });
export const setGame = (gameId: number | null): Action => ({ type: SET_GAME, payload: { gameId } });
export const setHunchWager = (wager: string): Action => ({ type: SET_WAGER, payload: { wager } });
