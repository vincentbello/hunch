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
  Splash__grow: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  grow: boolean,
  heading: string,
  iconName: string,
  renderSubhead: null | () => React.Node,
};

const Splash = ({ fullScreen, grow, heading, iconName, renderSubhead }: Props): React.Node => (
  <View style={[grow && styles.Splash__grow, !grow && (fullScreen ? SplashStyles : SplashStylesWithNav)]}>
    <Icon style={styles.Splash__icon} name={iconName} size={48} color={Colors.textPrimary} />
    <Text style={styles.Splash__heading}>{heading}</Text>
    {renderSubhead !== null && renderSubhead()}
  </View>
);

Splash.defaultProps = { grow: false, fullScreen: false, renderSubhead: null };
Splash.displayName = 'Splash';
export default Splash;
