// @flow
import * as React from 'react';
import { AsyncStorage, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({});

type Props = {
  iconName: string,
  targetScene: string,
};

const NavButton = ({ iconName, targetScene }: Props): React.Node => (
  <Icon.Button
    backgroundColor="transparent"
    color={Colors.brand.primary}
    iconStyle={{ marginRight: 4, marginLeft: 4 }}
    name={iconName}
    size={24}
    onPress={Actions[targetScene]}
  />
);

export default NavButton;
