// @flow
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { connect, Provider as ReduxProvider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { Router } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/integration/react';

import AppRoutes from 'src/navigation';
import apolloClient from './apollo/client';
import reduxStore, { persistor } from './store';

const RouterWithRedux = connect()(Router);

export default class App extends React.Component<{}> {
  render(): React.Node {
    return (
      <ReduxProvider store={reduxStore}>
        <ApolloProvider client={apolloClient}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterWithRedux navigator={AppRoutes} />
          </PersistGate>
        </ApolloProvider>
      </ReduxProvider>
    );
  }
}
