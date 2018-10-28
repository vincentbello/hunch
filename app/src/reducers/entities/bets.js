// @flow
import { handle } from 'redux-pack';
import dotProp from 'dot-prop-immutable';
import { CREATE_BET } from 'actions/createBet';
import { CANCEL_REQUEST, FETCH_BET, FETCH_BETS, REMIND, RESPOND_TO_BET } from 'actions/bets';
import { parseEntity, toEntities } from 'utils/normalization';

import { type BetEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function betEntitiesReducer(state: BetEntities = {}, action: Action): BetEntities {
  switch (action.type) {
    case CANCEL_REQUEST: {
      return handle(state, action, {
        success: (prevState: BetEntities): BetEntities => dotProp.delete(prevState, action.meta.betId),
      });
    }
    case CREATE_BET:
      return handle(state, action, {
        success: (prevState: BetEntities): BetEntities => ({
          ...prevState,
          [action.payload.data.id]: parseEntity(action.payload.data),
        }),
      });

    case FETCH_BET:
    case REMIND:
    case RESPOND_TO_BET:
      return handle(state, action, {
        success: (prevState: BetEntities): BetEntities => ({
          ...prevState,
          [action.payload.data.id]: parseEntity(action.payload.data, ['bettor', 'bettee', 'game']),
        }),
      });

    case FETCH_BETS:
      return handle(state, action, {
        success: (prevState: BetEntities): BetEntities => ({
          ...prevState,
          ...toEntities(action.payload.data, ['bettor', 'bettee', 'game']),
        }),
      });

    default:
      return state;
  }
}
