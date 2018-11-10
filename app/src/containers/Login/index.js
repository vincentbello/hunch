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

  loginToFacebook = () => {
    this.setState({ isAuthenticating: true });
    LoginManager.logInWithReadPermissions(['public_profile', 'email', 'user_friends'])
      .then((result) => {
        if (result.isCancelled) {
          console.error('Login was cancelled');
          this.setState({ isAuthenticating: false });
        } else {
          return AccessToken.getCurrentAccessToken();
        }
      }, console.error)
      .then(({ accessToken }) => {
        this.setState({ isAuthenticating: false });
        try {
          const { data: { login } } = await this.props.login({ variables: { accessToken, type: 'FACEBOOK' } }),
          await AsyncStorage.multiSet([['accessToken', login.accessToken, 'refreshToken', login.refreshToken]]);
          new NotificationService(({ os, token }): void => this.props.registerDevice({ variables: { os, token } }));
          Actions.main();
        } catch (err) {
          // Log error
        }
      });
  };

  render(): React.Node {
    return (
      <View style={SplashStyles}>
        <Text style={{ ...Typography.h1, marginBottom: 16 }}>Welcome to Hunch!</Text>
        <TouchableOpacity
          disabled={this.state.isAuthenticating}
          onPress={this.loginToFacebook}
        >
          {isLoggingIn ? (
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
