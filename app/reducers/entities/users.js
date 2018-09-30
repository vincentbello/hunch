// @flow
import { handle } from 'redux-pack';
import { FETCH_BETS } from 'actions/bets';
import { FETCH_USERS } from 'actions/users';
import { toEntities, toNestedEntities } from 'utils/normalization';

import { type Bet } from 'types/bet';
import { type User } from 'types/user';
import { type UserEntities } from 'types/entities';
import { type Action } from 'types/redux';

export default function userEntitiesReducer(state: UserEntities = {}, action: Action): UserEntities {
  switch (action.type) {
    case FETCH_BETS:
      return handle(state, action, {
        success: (prevState: UserEntities): UserEntities => ({
          ...prevState,
          ...toNestedEntities(action.payload.data, ['bettor', 'bettee']),
        }),
      });

    case FETCH_USERS:
      return handle(state, action, {
        success: (prevState: UserEntities): UserEntities => ({
          ...prevState,
          ...toEntities(action.payload.data),
        }),
      });

    default:
      return state;
  }
}
