// @flow
import * as React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { type Error } from 'types/apollo';

import Splash from 'components/Splash';
import Spinner from 'components/Spinner';

import AppSizes from 'theme/sizes'

const styles = StyleSheet.create({
  Splash: {
    width: AppSizes.screen.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Splash_full: {
    flex: 1,
  },
});

type Props = {
  children: React.Node,
  error?: Error,
  loading: boolean,
  size: 'small' | 'medium' | 'large',
  withCachedData: boolean,
};

const defaultProps = {
  loading: false,
  error: undefined,
  size: 'large',
  withCachedData: false,
};

const DerivedStateSplash = ({ children, error, loading, size, withCachedData }: Props): React.Node => {
  if (withCachedData) return children;

  if (loading) return (
    <View style={[styles.Splash, size === 'large' && styles.Splash_full]}>
      <Spinner size={size} />
    </View>
  );

  return Boolean(error) ? (
    <Splash heading={error.errors.length > 0 ? error.errors[0].message : 'An error occurred.'} iconName="alert-triangle" />
  ) : children;
};

DerivedStateSplash.defaultProps = defaultProps;
DerivedStateSplash.displayName = 'DerivedStateSplash';
export default DerivedStateSplash;
