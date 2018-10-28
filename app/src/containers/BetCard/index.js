// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBet } from 'selectors/bets';
import { fetchBet } from 'actions/bets';

import { type Bet } from 'types/bet';
import { type User } from 'types/user';
import { type Action, type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';
import AppSizes from 'theme/sizes';

import Image from 'components/Image';
import PromiseStateSplash from 'components/PromiseStateSplash';

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
    backgroundColor: Colors.white,
    borderRadius: 2,
    margin: 8,
    padding: 8,
  },
  Bet__header: {
    flexDirection: 'row',
  },
  Bet__user: {
    alignItems: 'center',
    width: 90,
  },
  Bet__userLabel: {
    fontWeight: '800',
    fontSize: 15,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  Bet__userMeta: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  Bet__userBadge: {
    marginTop: 4,
    borderWidth: 2,
    borderColor: Colors.brand.primary,
    borderRadius: 4,
    padding: 4,
  },
  Bet__userBadgeText: {
    fontWeight: '900',
    fontSize: 10,
    color: Colors.brand.primary,
  },
  Bet__main: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});

class BetCardContainer extends React.Component<Props> {
  static displayName = 'BetCardContainer';

  componentWillMount() {
    if (this.props.betId && this.props.bet.data === null) this.props.actions.fetchBet(this.props.betId);
  }

  renderBet = (): React.Node => this.props.bet.data && (
    <Text>{this.props.bet.data.wager}</Text>
  );

  renderUser = (user: User, isBettor: boolean = false): React.Node => (
    <View style={styles.Bet__user}>
      <Image rounded size="large" url={user.imageUrl} />
      <Text style={styles.Bet__userLabel}>{user.fullName}</Text>
      <Text style={styles.Bet__userMeta}>Record: {isBettor ? '7-4' : '3-9'}</Text>
      {isBettor && (
        <View style={styles.Bet__userBadge}>
          <Text style={styles.Bet__userBadgeText}>CHALLENGER</Text>
        </View>
      )}
    </View>
  );

  render(): React.Node {
    const { bet } = this.props;
    return (
      <PromiseStateSplash promiseState={bet}>
        {bet.data !== null && (
          <View style={styles.Bet}>
            <View style={styles.Bet__header}>
              {this.renderUser(bet.data.bettor, true)}
              <View style={styles.Bet__main}>
                <Text>{bet.data.wager}</Text>
              </View>
              {this.renderUser(bet.data.bettee)}
            </View>
          </View>
        )}
      </PromiseStateSplash>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetCardContainer);
