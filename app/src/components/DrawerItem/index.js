// @flow
import * as React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Colors from 'theme/colors';

const TYPE_COLORS = {
  danger: Colors.primary.red,
  default: Colors.textPrimary,
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.white,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  label_danger: {
    color: Colors.primary.red,
  },
});

export type ItemType = 'default' | 'danger';

type Props = {
  disabled?: boolean,
  iconName: string,
  label: string,
  type?: ItemType,
  onPress: () => void,
};

export const defaultProps = {
  disabled: false,
  type: 'default',
};

const DrawerItem = ({ disabled, iconName, label, type, onPress }: Props): React.Node => (
  <TouchableOpacity disabled={disabled} style={styles.item} onPress={onPress}>
    <Icon name={iconName} color={TYPE_COLORS[type]} size={24} />
    <Text style={[styles.label, type !== defaultProps && styles[`label_${type}`]]}>{label}</Text>
  </TouchableOpacity>
);

DrawerItem.displayName = 'DrawerItem';
DrawerItem.defaultProps = defaultProps;
export default DrawerItem;
