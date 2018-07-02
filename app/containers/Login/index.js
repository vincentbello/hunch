// @flow
import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { connect } from 'react-redux';

import { SocialIcon } from 'react-native-elements';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = {};

class LoginContainer extends React.Component<{}> {
  render(): React.Node {
    return (
      <View style={SplashStyles}>
        <Text style={{ ...Typography.h1, marginBottom: 16 }}>Welcome to Hunch!</Text>
        <TouchableOpacity onPress={() => console.log('FB LOGIN')}>
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
