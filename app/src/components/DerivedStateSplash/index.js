// @flow
import * as React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { type Error } from 'types/apollo';

import Splash from 'components/Splash';
import Spinner from 'components/Spinner';

import Colors from 'theme/colors';
import AppSizes from 'theme/sizes'

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
      <Spinner size="large" />
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
