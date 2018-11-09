// @flow
import * as React from 'react';
import ApolloClient from 'apollo-client';
import { AsyncStorage, View, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import NotificationService from 'services/NotificationService';

import GET_CURRENT_USER from 'graphql/queries/getCurrentUser';
import REFRESH_AUTH from 'graphql/mutations/refreshAuth';
import REGISTER_DEVICE from 'graphql/mutations/registerDevice';

import withApolloClient from 'hocs/withApolloClient';

const styles = StyleSheet.create({
  Launch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Launch__text: {
    fontSize: 36,
  },
});

type Props = {
  apolloClient: ApolloClient,
};

class AppLaunch extends React.Component<Props> {
  componentDidMount() {
    this.autoLogin();
  }

  autoLogin = async (): Promise<void> => {
    // TODO: Set timer (maybe in Apollo client?) to refresh auth token
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (refreshToken === null) { // No record
      Actions.loginModal();
    } else {
      const { apolloClient } = this.props;
      try {
        const { data: { refreshAuth } } = await apolloClient.mutate({
          mutation: REFRESH_AUTH,
          variables: { refreshToken },
          update: (cache, { data: { refreshAuth: currentUser } }) => cache.writeQuery({ query: GET_CURRENT_USER, data: { currentUser } }),
        });
        await AsyncStorage.multiSet([['accessToken', refreshAuth.accessToken, 'refreshToken', refreshAuth.refreshToken]]);
        new NotificationService(({ os, token }): void => apolloClient.mutate({ mutate: REGISTER_DEVICE, variables: { os, token } }));
        Actions.main();
      } catch (err) {
        Actions.loginModal();
      }
    }
  };

  render(): React.Node {
    return (
      <View style={styles.Launch}>
        <Text style={styles.Launch__text}>Hunch</Text>
      </View>
    );
  }
}

export default withApolloClient(AppLaunch);
