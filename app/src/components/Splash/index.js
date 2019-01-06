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
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splash_tabs: {
    height: SplashStylesWithNav.height - 64,
  },
  icon: {
    marginBottom: 16,
  },
  image: {
    width: 90,
    height: 120,
    marginBottom: 16,
  },
  heading: {
    ...Typography.h3,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});

const ILLUSTRATIONS = {
  MEH_LIGHTBULB: require('../../../assets/illustrations/meh-lightbulb.png'),
};

type VisualType = 'icon' | 'illustration';

type Props = {
  fullScreen: boolean,
  grow: boolean,
  heading: string,
  inTabs: boolean,
  visualName: string,
  visualType: VisualType,
  renderSubhead: null | () => React.Node,
};

const Visual = ({ name, type }: { name: string, type: VisualType }): React.Node => {
  switch (type) {
    case 'icon':
      return <Icon style={styles.icon} name={name} size={48} color={Colors.textPrimary} />;

    case 'illustration': {
      return <Image style={styles.image} source={ILLUSTRATIONS[name]} />;
    }

    default:
      return null;
  }
};

const Splash = ({ fullScreen, grow, heading, inTabs, visualName, visualType, renderSubhead }: Props): React.Node => (

  <View style={[grow && styles.splash, !grow && (fullScreen ? SplashStyles : SplashStylesWithNav), inTabs && styles.splash_tabs]}>
    <Visual name={visualName} type={visualType} />
    <Text style={styles.heading}>{heading}</Text>
    {renderSubhead !== null && renderSubhead()}
  </View>
);

Splash.defaultProps = {
  grow: false,
  inTabs: false,
  fullScreen: false,
  visualType: 'icon',
  renderSubhead: null,
};
Splash.displayName = 'Splash';
export default Splash;
