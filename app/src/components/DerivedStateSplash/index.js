// @flow
import * as React from 'react';
import { initialPromiseState } from 'utils/handlePromise';
import { ActivityIndicator, AsyncStorage, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { type Error } from 'types/apollo';
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
  error?: Error,
  loading: boolean,
  withCachedData: boolean,
};

const DerivedStateSplash = ({ children, error, loading, withCachedData }: Props): React.Node => {
  if (withCachedData) return children;

  if (loading) return (
    <View style={styles.Splash}>
      <ActivityIndicator size="large" color={Colors.brand.primary} />
    </View>
  );

  return Boolean(error) ? (
    <Splash heading={error.errors.length > 0 ? error.errors[0].message : 'An error occurred.'} iconName="alert-triangle" />
  ) : children;
};

DerivedStateSplash.defaultProps = {
  loading: false,
  error: undefined,
  withCachedData: false,
};
DerivedStateSplash.displayName = 'DerivedStateSplash';
export default DerivedStateSplash;
