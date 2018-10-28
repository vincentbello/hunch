// @flow
import * as React from 'react';
import { initialPromiseState } from 'utils/handlePromise';
import { ActivityIndicator, AsyncStorage, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { type PromiseState } from 'types/redux';

import Icon from 'react-native-vector-icons/Feather';

import Splash from 'components/Splash';

import Colors from 'theme/colors';
import { SplashStylesWithNav } from 'theme/app';
import AppSizes from 'theme/sizes';

const styles = StyleSheet.create({
  Splash: {
    flex: 1,
    width: AppSizes.screen.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  children: React.Node,
  promiseState: PromiseState<*>,
};

const PromiseStateSplash = ({ children, promiseState }: Props): React.Node => {
  if (promiseState.isLoading) return (
    <View style={styles.Splash}>
      <ActivityIndicator size="large" color={Colors.brand.primary} />
    </View>
  );

  return promiseState.hasError ? (
    <Splash heading={promiseState.hasError ? promiseState.error.message : 'An error occurred.'} iconName="alert-triangle" />
  ) : children;
};

PromiseStateSplash.defaultProps = { promiseState: { ...initialPromiseState } };
PromiseStateSplash.displayName = 'PromiseStateSplash';
export default PromiseStateSplash;
