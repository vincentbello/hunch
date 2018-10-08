// @flow
import { handle } from 'redux-pack';
import { CREATE_BET } from 'actions/createBet';
import { FETCH_BET, FETCH_BETS, RESPOND_TO_BET } from 'actions/bets';
import { parseEntity, toEntities } from 'utils/normalization';

import { type BetEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function betEntitiesReducer(state: BetEntities = {}, action: Action): BetEntities {
  switch (action.type) {
    case CREATE_BET:
      return handle(state, action, {
        success: (prevState: BetEntities): BetEntities => ({
          ...prevState,
          [action.payload.data.id]: parseEntity(action.payload.data),
        }),
      });

    case FETCH_BET:
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
