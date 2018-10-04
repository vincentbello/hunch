// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBets } from 'selectors/bets';
import { fetchBets } from 'actions/bets';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';

import BetCell from 'components/BetCell';

type ReduxProps = {
  bets: PromiseState<Array<Bet>>,
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  bets: getBets(state, { listType: 'requested' }),
  user: state.user,
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchBets }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchBets: (listType: string) => void,
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

  renderBets = (): React.Node => this.props.bets.data !== null && (
    <FlatList
      data={this.props.bets.data}
      keyExtractor={(bet: Bet): string => `${bet.id}`}
      onRefresh={this.fetchBets}
      refreshing={this.props.bets.isLoading}
      renderItem={({ item }): React.Node => (
        <BetCell
          bet={item}
          disabled
          userId={this.props.user.data.id}
        />
      )}
    />
  );

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
