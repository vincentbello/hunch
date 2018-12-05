// @flow
import * as React from 'react';
import { Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Mutation } from 'react-apollo';
import { LoginManager } from 'react-native-fbsdk';
import LOGOUT from 'graphql/mutations/logout';

import DrawerItem from 'components/DrawerItem';

const LogoutDrawerItem = (): React.Node => (
  <Mutation mutation={LOGOUT}>
    {(logout, { client, loading }): React.Node => (
      <DrawerItem
        disabled={loading}
        iconName="log-out"
        label="Log Out"
        type="danger"
        onPress={(): void => Alert.alert('Log Out', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Log Out',
            style: 'destructive',
            onPress: async (): Promise<void> => {
              await logout();
              await LoginManager.logOut();
              client.resetStore();
              Actions.loginModal();
            },
          },
        ])}
      />
    )}
  </Mutation>
);

LogoutDrawerItem.displayName = 'LogoutDrawerItem';
export default LogoutDrawerItem;
