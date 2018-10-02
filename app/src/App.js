// @flow
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { Router } from 'react-native-router-flux';
import { PersistGate } from 'redux-persist/integration/react';

import AppRoutes from 'src/navigation';
import store, { persistor } from './store';

const RouterWithRedux = connect()(Router);

export default class App extends React.Component<{}> {
  render(): React.Node {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterWithRedux navigator={AppRoutes} />
        </PersistGate>
      </Provider>
    );
  }
}
