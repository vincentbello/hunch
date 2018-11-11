// @flow
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import BetList from 'components/BetList';

const styles = StyleSheet.create({
  Bets: {
    flex: 1,
    paddingTop: 8,
  },
});

const BetRequestsContainer = ({ currentUser }: CurrentUserProps): React.Node => (
  <View style={styles.Bets}>
    <BetList betListType="REQUESTED" user={currentUser} />
  </View>
);
BetRequestsContainer.displayName = 'BetRequestsContainer';

export default withCurrentUser(BetRequestsContainer);
