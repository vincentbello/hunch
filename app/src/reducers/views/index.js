// @flow
import { combineReducers } from 'redux';

import betLists from 'reducers/views/betLists';
import createBet from 'reducers/views/createBet';

export default combineReducers({
  betLists,
  createBet,
});
