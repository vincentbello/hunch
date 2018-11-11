// @flow
import * as React from 'react';
import { ApolloProvider } from 'react-apollo';
import { connect, Provider as ReduxProvider } from 'react-redux';
import { Router } from 'react-native-router-flux';

import AppRoutes from 'src/navigation';
import apolloClient from './apollo/client';
import reduxStore from './store';

const RouterWithRedux = connect()(Router);

const App = (): React.Node => (
  <ReduxProvider store={reduxStore}>
    <ApolloProvider client={apolloClient}>
      <RouterWithRedux navigator={AppRoutes} />
    </ApolloProvider>
  </ReduxProvider>
);
export default App;
