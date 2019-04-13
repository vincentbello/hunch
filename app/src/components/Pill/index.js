// @flow
import * as React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

const styles = StyleSheet.create({
  Pill: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Colors.brand.primary,
  },
  Pill__label: {
    padding: 8,
    color: Colors.white,
  },
  Pill__iconContainer: {
    marginRight: 4,
  },
  Pill__iconButton: {
    padding: 4,
  },
  Pill__icon: {
    marginRight: 0,
  },
});

type Props = {
  canRemove: boolean,
  label: string,
  onRemove: () => void,
};

const defaultProps = {
  canRemove: false,
  onRemove() {},
};

const Pill = ({ canRemove, label, onRemove }: Props): React.Node => (
  <View style={styles.Pill}>
    <Text style={styles.Pill__label}>{label}</Text>
    {canRemove && (
      <View style={styles.Pill__iconContainer}>
        <Icon.Button
          style={styles.Pill__iconButton}
          backgroundColor="transparent"
          color={Colors.white}
          iconStyle={styles.Pill__icon}
          name="x"
          size={16}
          underlayColor="#ffffff25"
          onPress={onRemove}
        />
      </View>
    )}
  </View>
);

Pill.defaultProps = defaultProps;

export default Pill;
