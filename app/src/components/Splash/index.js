// @flow
import * as React from 'react';
import { AsyncStorage, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { distanceInWordsToNow } from 'date-fns';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles, SplashStylesWithNav } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Splash__icon: {
    marginBottom: 16,
  },
  Splash__heading: {
    ...Typography.h3,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});

type Props = {
  fullScreen: boolean,
  heading: string,
  iconName: string,
};

const Splash = ({ fullScreen, heading, iconName }: Props): React.Node => (
  <View style={fullScreen ? SplashStyles : SplashStylesWithNav}>
    <Icon style={styles.Splash__icon} name={iconName} size={48} color={Colors.textPrimary} />
    <Text style={styles.Splash__heading}>{heading}</Text>
  </View>
);

Splash.defaultProps = { fullScreen: false };
Splash.displayName = 'Splash';
export default Splash;
