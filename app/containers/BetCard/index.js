// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBet } from 'selectors/bets';
import { fetchBet } from 'actions/bets';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';

import BetCell from 'components/BetCell';

type ReduxProps = {
  bet: PromiseState<Bet>,
  user: UserState,
};

type ExternalProps = {
  betId: number,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState, props: ExternalProps): ReduxProps => ({
  bet: getBet(state, props),
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchBet }, dispatch),
  }
});

type Props = ExternalProps & ReduxProps & {
  actions: {
    fetchBet: (betId: number) => void,
  },
};

const styles = StyleSheet.create({
  Bet: {
    backgroundColor: 'blue',
  },
});

class BetCardContainer extends React.Component<Props> {
  static displayName = 'BetCardContainer';

  componentWillMount() {
    if (this.props.betId && this.props.bet.data === null) this.props.actions.fetchBet(this.props.betId);
  }

  renderBet = (): React.Node => this.props.bet.data !== null && (
    <Text>{this.props.bet.data.wager}</Text>
  );

  render(): React.Node {
    const { bet } = this.props;
    return (
      <View style={[styles.Bet, bet.isLoading && SplashStyles]}>
        {bet.isLoading ? (
          <ActivityIndicator size="large" color={Colors.brand.primary} />
        ) : this.renderBet()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetCardContainer);
