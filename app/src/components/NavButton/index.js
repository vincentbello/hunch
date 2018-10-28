// @flow
import * as React from 'react';
import { AsyncStorage, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

// import PushNotification from 'react-native-push-notification';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Badge_left: {
    left: 0,
  },
  Badge__text: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

type Props = {
  badgeCount: number,
  iconName: string,
  leftBadge: boolean,
  targetScene: string,
};

const NavButton = ({ badgeCount, leftBadge, iconName, targetScene }: Props): React.Node => (
  <View>
    <Icon.Button
      backgroundColor="transparent"
      color={Colors.brand.primary}
      iconStyle={{ marginRight: 4, marginLeft: 4 }}
      name={iconName}
      size={24}
      onPress={Actions[targetScene]}
    />
    {badgeCount > 0 && (
      <View style={[styles.Badge, leftBadge && styles.Badge_left]}>
        <Text style={styles.Badge__text}>{badgeCount}</Text>
      </View>
    )}
  </View>
);

NavButton.defaultProps = {
  badgeCount: 0,
  leftBadge: false,
};

export default NavButton;
