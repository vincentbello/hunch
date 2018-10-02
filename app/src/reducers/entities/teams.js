// @flow
import { handle } from 'redux-pack';
import { FETCH_GAMES } from 'actions/games';
import { toNestedEntities } from 'utils/normalization';

import { type TeamEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function teamEntitiesReducer(state: TeamEntities = {}, action: Action): TeamEntities {
  switch (action.type) {
    case FETCH_GAMES:
      return handle(state, action, {
        success: (prevState: TeamEntities): TeamEntities => ({
          ...prevState,
          ...toNestedEntities(action.payload.data, ['homeTeam', 'awayTeam']),
        }),
      });

    default:
      return state;
  }
}
