// @flow
import * as React from 'react';
import ApolloClient from 'apollo-client';
import { Animated, AsyncStorage, Easing, Image, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import NotificationService from 'services/NotificationService';

import GET_CURRENT_USER from 'graphql/queries/getCurrentUser';
import REFRESH_AUTH from 'graphql/mutations/refreshAuth';
import REGISTER_DEVICE from 'graphql/mutations/registerDevice';

import withApolloClient from 'hocs/withApolloClient';

import AppSizes from 'theme/sizes';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const ANIMATION_DURATION = 200;
const IMG_DIMENSION = AppSizes.screen.widthHalf;
const NAV_IMG_DIMENSION = 48;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: IMG_DIMENSION,
    height: IMG_DIMENSION,
  },
});

type Props = {
  apolloClient: ApolloClient,
};

type State = {
  bottomTop: Animated.Value,
  dimensionRatio: Animated.Value,
  topTop: Animated.Value,
};

class AppLaunch extends React.Component<Props, State> {
  state = {
    bottomTop: new Animated.Value((AppSizes.screen.height - 2.15 * IMG_DIMENSION + 20) / 2),
    dimensionRatio: new Animated.Value(1),
    topTop: new Animated.Value((AppSizes.screen.height - IMG_DIMENSION + 20) / 2),
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
          if (os && token) apolloClient.mutate({ mutation: REGISTER_DEVICE, variables: { os: os.toUpperCase(), token } });
        });
        this.startAnimation();
      } catch (err) {
        console.log('Refresh auth error', err);
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
        Actions.loginModal();
      }
    }
  };

  startAnimation = () => {
    const { bottomTop, dimensionRatio, topTop } = this.state;
    Animated.parallel([
      Animated.timing(bottomTop, {
        duration: ANIMATION_DURATION,
        toValue: AppSizes.screen.height,
      }),
      Animated.timing(dimensionRatio, {
        duration: ANIMATION_DURATION,
        toValue: 0,
      }),
      Animated.timing(topTop, {
        duration: ANIMATION_DURATION,
        toValue: AppSizes.statusBarHeight + AppSizes.topOffset + 22,
      }),
    ]).start(Actions.main);
  };

  render(): React.Node {
    const { bottomTop, dimensionRatio, topTop } = this.state;
    const height = dimensionRatio.interpolate({ inputRange: [0, 1], outputRange: [NAV_IMG_DIMENSION / 2, IMG_DIMENSION / 2] });
    const width = dimensionRatio.interpolate({ inputRange: [0, 1], outputRange: [NAV_IMG_DIMENSION, IMG_DIMENSION] });
    return (
      <View style={styles.container}>
        <AnimatedImage
          style={{ height, width, top: topTop }}
          source={require('../../../assets/brand/logo-top.png')}
        />
        <AnimatedImage
          style={[styles.image, { top: bottomTop }]}
          source={require('../../../assets/brand/logo-bottom.png')}
        />
      </View>
    );
  }
}

export default withApolloClient(AppLaunch);
