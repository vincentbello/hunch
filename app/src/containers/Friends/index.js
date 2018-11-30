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
  friendsQuery: {
    loading: boolean,
    error: Error,
    networkStatus: number,
    refetch: () => void,
    users: Array<User>,
  },
};

const FriendsContainer = ({ friendsQuery: { loading, error, networkStatus, refetch, users } }: Props): React.Node => (
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

FriendsContainer.displayName = 'UserCardContainer';
export default graphql(GET_USERS, { name: 'friendsQuery', options: { variables: { userListType: 'FRIENDS' } } })(FriendsContainer);
