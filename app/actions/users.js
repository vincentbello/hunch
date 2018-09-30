// @flow
import Api from 'api';

import { type Action } from 'types/redux';
import { type UserGroupType } from 'types/user';

export const FETCH_USERS = 'BETS/FETCH_USERS';

export const fetchUsers = (groupType: UserGroupType = 'friends'): Action => ({
  type: FETCH_USERS,
  promiseFn: () => Api.fetchUsers(groupType),
});
