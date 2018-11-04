// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { type Bet, type BetListType } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';

import BetList from 'components/BetList';

type Props = {
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  user: state.user,
});

const styles = StyleSheet.create({
  Bets: {
    flex: 1,
    paddingTop: 8,
  },
});

class BetRequestsContainer extends React.Component<Props> {
  static displayName = 'BetRequestsContainer';

  render(): React.Node {
    const { user } = this.props;
    return (
      <View style={styles.Bets}>
        <BetList betListType="REQUESTED" user={user.data} />
      </View>
    );
  }
}

export default connect(mapStateToProps)(BetRequestsContainer);
