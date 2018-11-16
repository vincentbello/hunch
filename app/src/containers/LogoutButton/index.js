// @flow
import * as React from 'react';
import { Actions } from 'react-native-router-flux';
import { Mutation } from 'react-apollo';
import { LoginManager } from 'react-native-fbsdk';
import LOGOUT from 'graphql/mutations/logout';
import NavButton from 'components/NavButton';

const LogoutButton = (): React.Node => (
  <Mutation mutation={LOGOUT}>
    {(logout, { client, loading }): React.Node => (
      <NavButton
        disabled={loading}
        iconName="log-out"
        onClick={async (): Promise<void> => {
          await logout();
          await LoginManager.logOut();
          client.resetStore();
          Actions.loginModal();
        }}
      />
    )}
  </Mutation>
);

LogoutButton.displayName = 'LogoutButtonContainer';
export default LogoutButton;
