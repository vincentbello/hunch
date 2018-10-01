// @flow
import { type Action } from 'types/redux';

export const SET_BETTEE = 'CREATE_BET/SET_BETTEE';

export const setBettee = (betteeId: number): Action => ({ type: SET_BETTEE, payload: { betteeId } });
