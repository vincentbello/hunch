// @flow
import * as React from 'react';
import { AsyncStorage, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  IconContainer: {
    marginLeft: 6,
    marginRight: 6,
  },
  IconButton: {
    padding: 0,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 2,
    paddingRight: 2,
  },
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
  backgroundColor: string,
  badgeCount: number,
  color: string,
  iconName: string,
  leftBadge: boolean,
  targetScene: string,
  onClick: () => void,
};

const NavButton = ({ backgroundColor, badgeCount, color, leftBadge, iconName, targetScene, onClick }: Props): React.Node => (
  <View style={styles.IconContainer}>
    <Icon.Button
      backgroundColor={backgroundColor}
      color={color}
      iconStyle={{ marginRight: 4, marginLeft: 4 }}
      style={styles.IconButton}
      name={iconName}
      size={24}
      underlayColor="rgba(0, 0, 0, 0.1)"
      onPress={targetScene ? Actions[targetScene] : onClick}
    />
    {badgeCount > 0 && (
      <View style={[styles.Badge, leftBadge && styles.Badge_left]}>
        <Text style={styles.Badge__text}>{badgeCount}</Text>
      </View>
    )}
  </View>
);

NavButton.defaultProps = {
  backgroundColor: 'transparent',
  badgeCount: 0,
  color: Colors.brand.primary,
  leftBadge: false,
  onClick() {},
};

export default NavButton;
