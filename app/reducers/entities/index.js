// @flow
import { combineReducers } from 'redux';

import bets from 'reducers/entities/bets';
import users from 'reducers/entities/users';

export default combineReducers({
  bets,
  users,
});
