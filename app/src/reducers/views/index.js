// @flow
import { combineReducers } from 'redux';

import hunchLists from 'reducers/views/hunchLists';
import createHunch from 'reducers/views/createHunch';

export default combineReducers({
  hunchLists,
  createHunch,
});
