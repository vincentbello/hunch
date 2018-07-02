// @flow

import { type BetEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function betEntitiesReducer(state: BetEntities = {}, action: Action): BetEntities {
  switch (action.type) {
    default:
      return state;
  }
}
