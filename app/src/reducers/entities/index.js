// @flow
import { combineReducers } from 'redux';

import bets from 'reducers/entities/bets';
import games from 'reducers/entities/games';
import teams from 'reducers/entities/teams';
import users from 'reducers/entities/users';

export default combineReducers({
  bets,
  games,
  teams,
  users,
});
