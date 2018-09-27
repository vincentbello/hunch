// @flow
import { handle } from 'redux-pack';
import { FETCH_BETS } from 'actions/bets';
import { toEntities } from 'utils/normalization';

import { type BetEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function betEntitiesReducer(state: BetEntities = {}, action: Action): BetEntities {
  switch (action.type) {
    case FETCH_BETS:
      return handle(state, action, {
        success: (prevState: BetEntities): BetEntities => ({ ...prevState, ...toEntities(action.payload.data) }),
      });

    default:
      return state;
  }
}
