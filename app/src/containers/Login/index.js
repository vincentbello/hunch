// @flow
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { authenticate } from 'actions/user';

import { type Action } from 'types/redux';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxStateSlice = {
  user: UserState,
};

type ReduxProps = {
  user: UserState,
};

type ActionProps = {
  actions: {
    authenticate: (fbToken: string) => void,
  },
};

// What data from the store shall we send to the comconst mapStateToProps = (state: ReduxStateSlice: ReduxProps => ({
  usr: state.user,
});
// Any actions to ma to the component?
const mapDispatchToProps = (dispatch: Action => any): ActionProp => ({
  ac Props = ReduxProps & ActionProps;

type State = { isAuthenticating: boolean };

class LoginContainer extends React.Component<Props, State> {
  state = { isAuthenticating: false };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.user.data === null && this.props.user.data !== null) Actions.bets();
  }

  get isLoggingIn(): boolean {
    return this.state.isAuthenticating || this.props.user.isLoading;
  }

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
        const { apolloClient } = this.props;
        try {
          const { data: { login } } = await apolloClient.mutate({
            mutation: LOGIN,
            variables: { accessToken, type: 'FACEBOOK' },
            update: (cache, { data: { login: currentUser } }) => cache.writeQuery({ query: GET_CURRENT_USER, data: { currentUser } }),
          });
          await AsyncStorage.multiSet([['accessToken', login.accessToken, 'refreshToken', login.refreshToken]]);
          new NotificationService(({ os, token }): void => apolloClient.mutate({ mutate: REGISTER_DEVICE, variables: { os, token } }));
          Actions.main();
        } catch (err) {
          Actions.loginModal();
        }
    
        // TODO: Mutation to log in, on update writeQuery to CURRENT_USER with result
        this.props.actions.authenticate(data.accessToken);
      });
  };

  render(): React.Node {
    const { isLoggingIn } = this;
    return (
      <View style={SplashStyles}>
        <Text style={{ ...Typography.h1, marginBottom: 16 }}>Welcome to Hunch!</Text>
        <TouchableOpacity
          disabled={isLoggingIn}
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
