// @flow
import { SET_VIEW_INDEX } from 'actions/bets';
import { type Action } from 'types/redux';

export type ReduxState = {
  viewIndex: number,
};

const initialState = {
  viewIndex: 0,
};

export default function betListsReducer(state: ReduxState = initialState, action: Action): ReduxState {
  switch (action.type) {
    case SET_VIEW_INDEX:
      return { ...state, viewIndex: action.payload.viewIndex };

    default:
      return state;
  }
}
