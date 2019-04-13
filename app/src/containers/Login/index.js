// @flow
import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Text, TouchableOpacity } from 'react-native';
import { compose, graphql } from 'react-apollo';
import NotificationService from 'services/NotificationService';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { API_URL } from 'react-native-dotenv';

import GET_CURRENT_USER from 'graphql/queries/getCurrentUser';
import LOGIN from 'graphql/mutations/login';
import REGISTER_DEVICE from 'graphql/mutations/registerDevice';

import { SocialIcon } from 'react-native-elements';

import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type Props = { login: () => void, registerDevice: () => void };

function LoginContainer({ login, registerDevice }: Props): React.Node {
  const [tokens, setTokens] = React.useState({ access: null, refresh: null });
  const [isAuthenticating, setAuthenticating] = React.useState(false);

  const retrieveTokens = async () => {
    const [[_1, access], [_2, refresh]] = await AsyncStorage.multiGet(['accessToken', 'refreshToken']);
    setTokens({ access, refresh });
  };

  React.useEffect(() => {
    retrieveTokens();
  }, []);

  const loginToFacebook = async () => {
    await LoginManager.logOut();
    setAuthenticating(true);
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']);
    if (result.isCancelled) {
      setAuthenticating(false);
      return;
    }

    const { accessToken } = await AccessToken.getCurrentAccessToken();
    const { data: { login } } = await login({ context: { headers: { access_token: accessToken } } });
    await AsyncStorage.multiSet([['accessToken', login.accessToken], ['refreshToken', login.refreshToken]]);
    new NotificationService(({ os, token }): void => {
      if (os && token) registerDevice({ variables: { os: os.toUpperCase(), token } });
    });
    Actions.main();
  };

  const renderAdminInfo = (): React.Node => (
    <React.Fragment>
      <Text style={{ fontSize: 10 }}>API URL: {API_URL}</Text>
      <Text style={{ fontSize: 10 }}>Access Token: {tokens.access}</Text>
      <Text style={{ fontSize: 10 }}>Refresh Token: {tokens.refresh}</Text>
    </React.Fragment>
  );

  return (
    <View style={SplashStyles}>
      <Text>API url: {API_URL}</Text>
      <Text style={{ ...Typography.h1, marginBottom: 16 }}>Welcome to Hunch!</Text>
      <TouchableOpacity
        disabled={isAuthenticating}
        onPress={loginToFacebook}
      >
        {isAuthenticating ? (
          <Text>Logging In...</Text>
        ) : (
          <SocialIcon
            button
            style={{ borderRadius: 4, padding: 16 }}
            title="Log in with Facebook"
            type="facebook"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default compose(
  graphql(LOGIN, {
    name: 'login',
    options: {
      update: (cache, { data: { login: currentUser } }) => cache.writeQuery({ query: GET_CURRENT_USER, data: { currentUser } }),
    },
  }),
  graphql(REGISTER_DEVICE, { name: 'registerDevice' }),
)(LoginContainer);
