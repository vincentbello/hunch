// @flow
import * as React from 'react';
import { Linking, View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { stringify } from 'query-string';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

import { SocialIcon } from 'react-native-elements';

import { authenticate } from 'actions/user';

import { FB_APP_ID } from 'constants/third-party';

import { type Action } from 'types/redux';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({
      authenticate,
    })
  }
});

class LoginContainer extends React.Component<{}> {
  componentDidMount() {
    Linking.addEventListener('url', this.handleURL);
  }

  handleURL = (event) => {
    console.log(event.url);
  };

  loginToFacebook = () => {
    // const params = stringify({
    //   response_type: 'token',
    //   client_id: FB_APP_ID,
    //   redirect_uri: `fb${FB_APP_ID}://authorize$scope=email`,
    // });
    // console.log('params', params);
    // Linking.openURL(`https://graph.facebook.com/oauth/authorize?${params}`);
    LoginManager.logInWithReadPermissions(['public_profile', 'email'])
      .then((result) => {
        console.log('RESULT', result);
        if (result.isCancelled) {
          console.log('Login was cancelled');
        } else {
          return AccessToken.getCurrentAccessToken();
        }
      }, console.log)
      .then((data) => {
        // Send access token to backend
        this.props.actions.authenticate(data.accessToken);
      });
  };

  render(): React.Node {
    return (
      <View style={SplashStyles}>
        <Text style={{ ...Typography.h1, marginBottom: 16 }}>Welcome to Hunch!</Text>
        <TouchableOpacity onPress={this.loginToFacebook}>
          <SocialIcon
            button
            style={{ borderRadius: 4, padding: 16 }}
            title="Log in with Facebook"
            type="facebook"
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
