// @flow
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import Splash from 'components/Splash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
});

const Onboarding = ({ currentUser }: CurrentUserProps): React.Node => (
  <View style={styles.container}>
    <Splash
      fullScreen
      heading="Welcome to your HunchCard!"
      visualName="LAUGHING_LIGHTBULB"
      visualType="illustration"
    />
  </View>
);
Onboarding.displayName = 'Onboarding';

export default withCurrentUser(Onboarding);
