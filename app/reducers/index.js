import { combineReducers } from 'redux';

import entities from './entities';
import session from './session';
import user from './user';

export default combineReducers({
  entities,
  session,
  user,
});
