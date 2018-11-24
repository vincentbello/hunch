// @flow
import * as React from 'react';
import { AsyncStorage, View, Text, TouchableOpacity } from 'react-native';
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
type State = {
  accessToken: null | string,
  isAuthenticating: boolean,
  refreshToken: null | string,
};

class LoginContainer extends React.Component<Props, State> {
  state = {
    accessToken: null,
    isAuthenticating: false,
    refreshToken: null,
  };

  async componentDidMount(): Promise<void> {
    const [[_1, accessToken], [_2, refreshToken]] = await AsyncStorage.multiGet(['accessToken', 'refreshToken']);
    this.setState({ accessToken, refreshToken });
  }

  loginToFacebook = async (): Promise<void> => {
    await LoginManager.logOut();
    this.setState({ isAuthenticating: true });
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends']);
    if (result.isCancelled) {
      this.setState({ isAuthenticating: false });
      return;
    }

    const { accessToken } = await AccessToken.getCurrentAccessToken();
    const { data: { login } } = await this.props.login({ context: { headers: { access_token: accessToken } } });
    await AsyncStorage.multiSet([['accessToken', login.accessToken], ['refreshToken', login.refreshToken]]);
    new NotificationService(({ os, token }): void => {
      if (os && token) this.props.registerDevice({ variables: { os: os.toUpperCase(), token } });
    });
    Actions.main();
  };

  renderAdminInfo = (): React.Node => (
    <React.Fragment>
      <Text style={{ fontSize: 10 }}>API URL: {API_URL}</Text>
      <Text style={{ fontSize: 10 }}>Access Token: {this.state.accessToken}</Text>
      <Text style={{ fontSize: 10 }}>Refresh Token: {this.state.refreshToken}</Text>
    </React.Fragment>
  );

  render(): React.Node {
    return (
      <View style={SplashStyles}>
        <Text style={{ ...Typography.h1, marginBottom: 16 }}>Welcome to Hunch!</Text>
        <TouchableOpacity
          disabled={this.state.isAuthenticating}
          onPress={this.loginToFacebook}
        >
          {this.state.isAuthenticating ? (
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
