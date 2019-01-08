// @flow
import * as React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

import Favorites from 'containers/Favorites';
import FacebookFriendList from 'components/FacebookFriendList';
import Splash from 'components/Splash';

import AppSizes from 'theme/sizes';
import Colors from 'theme/colors';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderColor: Colors.transparent,
    borderWidth: 1,
  },
  swiper: {
    borderColor: Colors.transparent,
  },
  dots: {
    top: -24,
    bottom: undefined,
  },
  container: {
    flex: 1,
    paddingTop: 8,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  content: {
    width: AppSizes.screen.width,
  },
});

const Onboarding = (): React.Node => (
  <View style={styles.wrapper}>
    <Swiper style={styles.swiper} paginationStyle={styles.dots}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to HunchCard!</Text>
        <Splash
          grow
          heading="Challenge your friends by calling sports events before they happen."
          visualName="SMILING_LIGHTBULB"
          visualType="illustration"
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Add friends so you can challenge them.</Text>
        <View style={styles.content}>
          <FacebookFriendList />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Manage your favorite teams.</Text>
        <View style={styles.content}>
          <Favorites />
        </View>
      </View>
    </Swiper>
  </View>
);
Onboarding.displayName = 'Onboarding';

export default Onboarding;
