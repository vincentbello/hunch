// @flow
import * as React from 'react';
import { AsyncStorage, View, StyleSheet, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { type Action } from 'types/redux';
import { type UserState } from 'reducers/user';

import Colors from 'theme/colors';
import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

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

export default class AppLaunch extends React.Component<{}> {
  componentDidMount() {
    // AsyncStorage.getItem('authToken')
    //   .then((data) => {
    //     if (data) {
    //       const authToken = JSON.parse(data);
    //     }
    //   });
  }

  render(): React.Node {
    return (
      <View style={styles.Launch}>
        <Text style={styles.Launch__text}>Hunch</Text>
      </View>
    );
  }
}
