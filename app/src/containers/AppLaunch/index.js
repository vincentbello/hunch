// @flow
import * as React from 'react';
import ApolloClient from 'apollo-client';
import { Animated, AsyncStorage, Easing, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import NotificationService from 'services/NotificationService';

import GET_CURRENT_USER from 'graphql/queries/getCurrentUser';
import REFRESH_AUTH from 'graphql/mutations/refreshAuth';
import REGISTER_DEVICE from 'graphql/mutations/registerDevice';

import withApolloClient from 'hocs/withApolloClient';

import AppSizes from 'theme/sizes';
import Colors from 'theme/colors';

const styles = StyleSheet.create({
  Launch: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Launch__navbar: {
    backgroundColor: Colors.white,
    height: AppSizes.statusBarHeight + AppSizes.navbarHeight + 10,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    alignSelf: 'flex-start',
  },
  Launch__container: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
  },
  Launch__text: {
    fontFamily: 'VeteranTypewriter',
    fontSize: 56,
    transform: [{ scaleY: 0.9 }],
  },
});

const ANIMATION_DURATION = 200;

type Props = {
  apolloClient: ApolloClient,
};

type State = {
  isAnimating: boolean,
  logoStyle: {
    fontSize: number,
    top: number,
  },
};

class AppLaunch extends React.Component<Props, State> {
  state = {
    isAnimating: false,
    logoStyle: {
      fontSize: new Animated.Value(56),
      top: new Animated.Value((AppSizes.screen.height - 80) / 2),
    },
  };

  componentDidMount() {
    this.autoLogin();
  }

  autoLogin = async (): Promise<void> => {
    // TODO: Set timer (maybe in Apollo client?) to refresh auth token
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken === null) { // No record
      Actions.loginModal();
    } else {
      const { apolloClient } = this.props;
      try {
        const { data: { refreshAuth } } = await apolloClient.mutate({
          mutation: REFRESH_AUTH,
          variables: { refreshToken },
          update: (cache, { data: { refreshAuth: currentUser } }) => cache.writeQuery({ query: GET_CURRENT_USER, data: { currentUser } }),
        });
        await AsyncStorage.multiSet([['accessToken', refreshAuth.accessToken], ['refreshToken', refreshAuth.refreshToken]]);
        new NotificationService(({ os, token }): void => {
          if (os && token) apolloClient.mutate({ mutation: REGISTER_DEVICE, variables: { os, token } });
        });
        this.startAnimation();
      } catch (err) {
        Actions.loginModal();
      }
    }
  };

  startAnimation = () => {
    const { fontSize, top } = this.state.logoStyle;
    this.setState({ isAnimating: true });
    Animated.parallel([
      Animated.timing(fontSize, { duration: ANIMATION_DURATION, easing: Easing.inOut(Easing.ease), toValue: 24 }),
      Animated.timing(top, { duration: ANIMATION_DURATION, easing: Easing.inOut(Easing.ease), toValue: AppSizes.statusBarHeight + 20 }),
    ]).start(Actions.main);
  };

  render(): React.Node {
    const { isAnimating, logoStyle } = this.state;
    const { fontSize, top } = logoStyle;
    return (
      <View style={styles.Launch}>
        {isAnimating && <View style={styles.Launch__navbar} />}
        <Animated.View style={{ ...styles.Launch__container, top }}>
          <Animated.Text style={{ ...styles.Launch__text, fontSize }}>HunchCard</Animated.Text>
        </Animated.View>
        {/* <TouchableOpacity onPress={this.startAnimation}><Text>ANIMATE</Text></TouchableOpacity> */}
      </View>
    );
  }
}

export default withApolloClient(AppLaunch);
