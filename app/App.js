// @flow
import * as React from 'react';
import { connect, Provider } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { Router } from 'react-native-router-flux';

import AppRoutes from './navigation';
import store from './store';

const RouterWithRedux = connect()(Router);

export default class App extends React.Component<{}> {
  render(): React.Node {
    return (
      <Provider store={store}>
        <RouterWithRedux scenes={AppRoutes} />
      </Provider>
    );
  }
}
