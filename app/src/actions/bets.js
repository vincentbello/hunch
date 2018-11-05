// @flow
import { type Action } from 'types/redux';

export const SET_VIEW_INDEX = 'BETS/SET_VIEW_INDEX';
export const setViewIndex = (viewIndex: number): Action => ({ type: SET_VIEW_INDEX, payload: { viewIndex } });
