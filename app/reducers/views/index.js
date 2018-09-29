// @flow
import { combineReducers } from 'redux';

import betCard from 'reducers/views/betCard';
import betLists from 'reducers/views/betLists';

export default combineReducers({
  betCard,
  betLists,
});
