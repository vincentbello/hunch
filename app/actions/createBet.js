// @flow
import { type Action } from 'types/redux';

export const SET_BET_AMOUNT = 'CREATE_BET/SET_BET_AMOUNT';
export const SET_BETTEE = 'CREATE_BET/SET_BETTEE';

export const setBetAmount = (amount: number): Action => ({ type: SET_BET_AMOUNT, payload: { amount } });
export const setBettee = (betteeId: number | null): Action => ({ type: SET_BETTEE, payload: { betteeId } });
