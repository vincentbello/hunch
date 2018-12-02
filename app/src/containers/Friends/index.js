// @flow
import * as React from 'react';
import { FlatList } from 'react-native';
import { graphql } from 'react-apollo';
import { Actions } from 'react-native-router-flux';
import GET_USERS from 'graphql/queries/getUsers';

import { type Error } from 'types/apollo';
import { type User } from 'types/user';

import DerivedStateSplash from 'components/DerivedStateSplash';
import UserCell from 'components/UserCell';

type Props = {
  enterTime: Date,
  friendsQuery: {
    loading: boolean,
    error: Error,
    networkStatus: number,
    refetch: () => void,
    users: Array<User>,
  },
  userId: number,
};

class FriendsContainer extends React.PureComponent<Props> {
  static displayName = 'FriendsContainer';

  static onEnter() {
    Actions.refresh({ enterTime: new Date() });
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.enterTime !== this.props.enterTime) this.props.friendsQuery.refetch();
  }

  render(): React.Node {
    const { friendsQuery: { loading, error, networkStatus, refetch, users } } = this.props;
    return (
      <DerivedStateSplash error={error} loading={loading}>
        {Boolean(users) && (
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
                withDisclosureIndicator
                onPress={(): void => Actions.userCard({ userId: item.id })}
              />
            )}
          />
        )}
      </DerivedStateSplash>
    );
  }
}

export default graphql(GET_USERS, {
  name: 'friendsQuery',
  options: ({ userId }) => ({
    variables: {
      userListType: 'FRIENDS',
      userId: userId || null,
    },
  }),
})(FriendsContainer);
