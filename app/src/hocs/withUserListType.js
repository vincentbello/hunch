// @flow
import * as React from 'react';
import { noop } from 'utils/functions';

import { type UserListType } from 'types/user';

import UserList from 'components/UserList';

type InjectedProps = {
  userListType: UserListType,
};

export default function withUserListType(userListType: UserListType): React.ComponentType<InjectedProps> {
  const Wrapped = (props: {}): React.Node => <UserList {...props} userListType={userListType} />;
  Wrapped.onEnter = UserList.onEnter || noop;
  return Wrapped;
}
