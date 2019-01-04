// @flow
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import HunchList from 'components/HunchList';

const styles = StyleSheet.create({
  Hunches: {
    flex: 1,
    paddingTop: 8,
  },
});

const HunchRequestsContainer = ({ currentUser }: CurrentUserProps): React.Node => (
  <View style={styles.Hunches}>
    <HunchList hunchListType="REQUESTED" user={currentUser} />
  </View>
);
HunchRequestsContainer.displayName = 'HunchRequestsContainer';

export default withCurrentUser(HunchRequestsContainer);
