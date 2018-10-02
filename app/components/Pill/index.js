// @flow
import * as React from 'react';
import { AsyncStorage, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
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
  Pill__icon: {
    padding: 4,
    marginRight: 4,
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
      <Icon.Button
        style={styles.Pill__icon}
        backgroundColor="transparent"
        color={Colors.white}
        iconStyle={{ marginRight: 0 }}
        name="x"
        size={16}
        onPress={onRemove}
      />
    )}
  </View>
);

Pill.defaultProps = defaultProps;

export default Pill;
