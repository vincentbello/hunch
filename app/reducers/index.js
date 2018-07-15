import { combineReducers } from 'redux';

import entities from 'reducers/entities';
import user from 'reducers/user';

export default combineReducers({
  entities,
  user,
});
