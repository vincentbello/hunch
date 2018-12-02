// @flow
import * as React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Colors from 'theme/colors';

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flex: 1,
  },
  buttonPlaceholder: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    overflow: 'hidden',
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  button_primary: {
    marginRight: 0,
    backgroundColor: Colors.brand.primary,
  },
  buttonText: {
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  buttonText_primary: {
    color: Colors.white,
  },
});

type Props = {
  canPerformPrimaryAction: boolean,
  canPerformSecondaryAction: boolean,
  primaryAction: () => void,
  secondaryAction: () => void,
  primaryLabel: string,
  secondaryLabel: string,
  primaryPlaceholder?: string,
  secondaryPlaceholder?: string,
};

const DualAction = ({
  canPerformPrimaryAction,
  canPerformSecondaryAction,
  primaryAction,
  secondaryAction,
  primaryLabel,
  secondaryLabel,
  primaryPlaceholder,
  secondaryPlaceholder,
}: Props): React.Node => (
  <View style={styles.actions}>
    {canPerformSecondaryAction ? (
      <TouchableOpacity onPress={secondaryAction} style={styles.buttonContainer}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{secondaryLabel}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <Text style={styles.buttonPlaceholder}>{secondaryPlaceholder}</Text>
    )}
    {canPerformPrimaryAction ? (
      <TouchableOpacity onPress={primaryAction} style={styles.buttonContainer}>
        <View style={[styles.button, styles.button_primary]}>
          <Text style={[styles.buttonText, styles.buttonText_primary]}>{primaryLabel}</Text>
        </View>
      </TouchableOpacity>
    ) : (
      <Text style={styles.buttonPlaceholder}>{primaryPlaceholder}</Text>
    )}
  </View>
);

DualAction.displayName = 'DualAction';
DualAction.defaultProps = {
  primaryPlaceholder: '',
  secondaryPlaceholder: '',
};
export default DualAction;
