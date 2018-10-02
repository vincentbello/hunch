// @flow
import { handle } from 'redux-pack';
import { FETCH_BET, FETCH_BETS } from 'actions/bets';
import { toEntities } from 'utils/normalization';

import { type BetEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function betEntitiesReducer(state: BetEntities = {}, action: Action): BetEntities {
  switch (action.type) {
    case FETCH_BET:
    case FETCH_BETS:
      return handle(state, action, {
        success: (prevState: BetEntities): BetEntities => ({
          ...prevState,
          ...toEntities(action.type === FETCH_BET ? [action.payload.data] : action.payload.data, ['bettor', 'bettee', 'game']),
        }),
      });

    default:
      return state;
  }
}
