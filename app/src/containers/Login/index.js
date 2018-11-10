// @flow
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// import graphql, mutations

import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type Props = { apolloClient: ApolloClient };
type State = { isAuthenticating: boolean };

class LoginContainer extends React.Component<Props, State> {
  state = { isAuthenticating: false };

  loginToFacebook = async () => {
    this.setState({ isAuthenticating: true });
    const result = await LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends'])
    if (result.isCancelled) {
      console.error('Login was cancelled');
      this.setState({ isAuthenticating: false });
      return;
    }

    const { accessToken } = AccessToken.getCurrentAccessToken();
    const { data: { login } } = await this.props.login({ variables: { accessToken, type: 'FACEBOOK' } }),
    await AsyncStorage.multiSet([['accessToken', login.accessToken, 'refreshToken', login.refreshToken]]);
    new NotificationService(({ os, token }): void => this.props.registerDevice({ variables: { os, token } }));
    this.setState({ isAuthenticating: false });
    Actions.main();
  };

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
  graphql({
    mutation: LOGIN,
    name: 'login',
    update: (cache, { data: { login: currentUser } }) => cache.writeQuery({ query: GET_CURRENT_USER, data: { currentUser } }),
  }),
  graphql({
    mutation: REGISTER_DEVICE,
    name: 'registerDevice',
  }),
)(LoginContainer);
