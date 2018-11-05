import { combineReducers } from 'redux';

import session from './session';
import user from './user';
import views from './views';

export default combineReducers({
  session,
  user,
  views,
});
