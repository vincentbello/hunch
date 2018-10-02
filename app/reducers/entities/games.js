// @flow
import { handle } from 'redux-pack';
import { FETCH_GAMES } from 'actions/games';
import { toEntities } from 'utils/normalization';

import { type GameEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function gameEntitiesReducer(state: GameEntities = {}, action: Action): GameEntities {
  switch (action.type) {
    case FETCH_GAMES:
      return handle(state, action, {
        success: (prevState: GameEntities): GameEntities => ({
          ...prevState,
          ...toEntities(action.payload.data, ['homeTeam', 'awayTeam']),
        }),
      });

    default:
      return state;
  }
}
