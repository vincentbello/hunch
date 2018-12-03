// @flow
import * as React from 'react';
import { FlatList } from 'react-native';
import { compose, graphql } from 'react-apollo';
import { Actions } from 'react-native-router-flux';
import GET_USERS from 'graphql/queries/getUsers';

import { type Error } from 'types/apollo';
import { type User, type UserListType } from 'types/user';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import DerivedStateSplash from 'components/DerivedStateSplash';
import Splash from 'components/Splash';
import UserCell from 'components/UserCell';

const USER_LIST_EMPTY_MESSAGES = {
  FRIENDS: 'You have no friends.',
  FRIEND_REQUESTS: 'You have no friend requests.',
};

type Props = CurrentUserProps & {
  enterTime: Date,
  userListType: UserListType,
  usersQuery: {
    loading: boolean,
    error: Error,
    networkStatus: number,
    refetch: () => void,
    users: Array<User>,
  },
  userId: number,
};

class UserList extends React.PureComponent<Props> {
  static displayName = 'UserList';

  static onEnter() {
    Actions.refresh({ enterTime: new Date() });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.enterTime !== this.props.enterTime) this.props.usersQuery.refetch();
  }

  renderUsers = (users: Array<User>): React.Node => {
    if (users.length === 0) return <Splash heading={USER_LIST_EMPTY_MESSAGES[this.props.userListType]} iconName="search" />;

    const { usersQuery: { networkStatus, refetch } } = this.props;
    const myId = this.props.currentUser.id;
    return (
      <FlatList
        data={users}
        keyExtractor={(user: User): string => `${user.id}`}
        onRefresh={refetch}
        refreshing={networkStatus === 4}
        renderItem={({ item }): React.Node => (
          <UserCell
            full
            inList
            user={item}
            withDisclosureIndicator={myId !== item.id}
            onPress={myId === item.id ? null : (): void => Actions.userCard({ userId: item.id })}
          />
        )}
      />
    );
  };

  render(): React.Node {
    const { usersQuery: { loading, error, users } } = this.props;
    return (
      <DerivedStateSplash error={error} loading={loading}>
        {Boolean(users) && this.renderUsers(users)}
      </DerivedStateSplash>
    );
  }
}

export default compose(
  withCurrentUser,
  graphql(GET_USERS, {
    name: 'usersQuery',
    options: ({ userId, userListType }) => ({
      variables: {
        userListType,
        userId: userId || null,
      },
    }),
  })
)(UserList);
