// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBets, getRespondingBetId } from 'selectors/bets';
import { fetchBets, respondToBet } from 'actions/bets';

import { type Bet, type BetListType } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';

import BetCell from 'components/BetCell';
import Splash from 'components/Splash';

type ReduxProps = {
  bets: PromiseState<Array<Bet>>,
  respondingBetId: number | null,
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  bets: getBets(state, { betListType: 'REQUESTED' }),
  respondingBetId: getRespondingBetId(state),
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchBets, respondToBet }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchBets: (betListType: BetListType) => void,
    respondToBet: (betId: number, index: number, accepted: boolean) => void,
  },
};

const styles = StyleSheet.create({
  Bets: {
    flex: 1,
    paddingTop: 8,
  },
});

class BetRequestsContainer extends React.Component<Props> {
  static displayName = 'BetRequestsContainer';

  componentWillMount() {
    if (!this.props.bets.didFetch) this.fetchBets();
  }

  fetchBets = (): void => {
    this.props.actions.fetchBets('requested');
  };

  renderBets = (): React.Node => {
    if (this.props.bets.data === null) return null;
    if (this.props.bets.data.length === 0) return <Splash heading="You have no bet requests." iconName="inbox" />;
    return (
      <FlatList
        data={this.props.bets.data}
        keyExtractor={(bet: Bet): string => `${bet.id}`}
        onRefresh={this.fetchBets}
        refreshing={this.props.bets.isLoading}
        renderItem={({ item, index }: { item: Bet, index: number }): React.Node => (
          <BetCell
            bet={item}
            disabled
            isResponding={item.id === this.props.respondingBetId}
            userId={this.props.user.data.id}
            respond={(accepted: boolean): void => this.props.actions.respondToBet(item.id, index, accepted)}
          />
        )}
      />
    );
  };

  render(): React.Node {
    const { bets } = this.props;
    return (
      <View style={[styles.Bets, bets.isLoading && SplashStyles]}>
        {bets.isLoading ? (
          <ActivityIndicator size="large" color={Colors.brand.primary} />
        ) : this.renderBets()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetRequestsContainer);
