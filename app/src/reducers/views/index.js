// @flow
import { combineReducers } from 'redux';

import betCard from 'reducers/views/betCard';
import betLists from 'reducers/views/betLists';
import createBet from 'reducers/views/createBet';

export default combineReducers({
  betCard,
  betLists,
  createBet,
});
