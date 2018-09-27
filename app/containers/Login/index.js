// @flow
import * as React from 'react';
import { Linking, View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { authenticate } from 'actions/user';

import { FB_APP_ID } from 'constants/third-party';

import { type Action } from 'types/redux';
import { type UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxStateSlice = {
  user: UserState,
};

type ReduxProps = {
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxStateSlice): ReduxProps => ({
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({
      authenticate,
    }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    authenticate: (fbToken: string) => void,
  },
};

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
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        if (result.isCancelled) {
          console.error('Login was cancelled');
          this.setState({ isAuthenticating: false });
        } else {
          return AccessToken.getCurrentAccessToken();
        }
      }, console.error)
      .then((data) => {
        this.setState({ isAuthenticating: false });
        // Send access token to backend
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
