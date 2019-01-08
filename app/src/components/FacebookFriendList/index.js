// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FlatList, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import GET_FACEBOOK_FRIENDS from 'graphql/queries/getFbFriends';

import { type Error } from 'types/apollo';
import { type User } from 'types/user';

import Colors from 'theme/colors';

import Icon from 'react-native-vector-icons/Feather';

import UserCell from 'components/UserCell';
import DerivedStateSplash from 'components/DerivedStateSplash';
import Splash from 'components/Splash';

type Props = {
  friendsQuery: {
    loading: boolean,
    error: Error,
    fbFriends: Array<User>,
  },
};

const styles = StyleSheet.create({});

function FacebookFriendList({ friendsQuery: { fbFriends, error, loading } }: Props): React.Node {
  const renderFriends = (friends: Array<User>): React.Node => {
    if (friends.length === 0) {
      return (
        <Splash
          grow
          heading="None of your Facebook friends are using Hunch."
          visualName="MEH_LIGHTBULB"
          visualType="illustration"
        />
      );
    }

    return (
      <FlatList
        data={friends}
        keyExtractor={(friend: User): string => `${friend.id}`}
        renderItem={({ item }): React.Node => (
          <UserCell
            inList
            size="small"
            user={item}
            renderMeta={(): React.Node => (
              <Icon.Button
                backgroundColor={Colors.transparent}
                color={Colors.brand.primary}
                style={{}}
                iconStyle={{}}
                name="user-plus"
                size={16}
                underlayColor="rgba(0, 0, 0, 0.1)"
                onPress={console.log}
              />
            )}
          />
        )}
      />
    );
  };

  return (
    <DerivedStateSplash error={error} loading={loading}>
      {Boolean(fbFriends) && renderFriends(fbFriends)}
    </DerivedStateSplash>
  );
}
FacebookFriendList.displayName = 'FacebookFriendList';

export default graphql(GET_FACEBOOK_FRIENDS, { name: 'friendsQuery' })(FacebookFriendList);
