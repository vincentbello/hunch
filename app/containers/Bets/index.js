// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getBets } from 'selectors/bets';
import { fetchBets } from 'actions/bets';
import Colors from 'theme/colors';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type State as ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Typography from 'theme/typography';

type ReduxProps = {
  bets: PromiseState<Array<Bet>>,
  user: UserState,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  bets: getBets(state, { listType: 'active' }),
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
  },
  Bets_splash: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  Bets__list: {
    marginTop: 8,
  },
  Bets__item: {
    flexDirection: 'row',
    height: 76,
    backgroundColor: 'white',
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
    alignItems: 'center',
  },
  Bets__itemImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
  },
  Bets__itemContent: {
    flex: 1,
  },
  Bets__itemMeta: {
    fontSize: 14,
    color: 'gray',
  },
});

class BetsContainer extends React.Component<Props> {
  componentWillMount() {
    this.fetchBets();
  }

  fetchBets = (): void => this.props.actions.fetchBets('active');

  renderBets = (): React.Node => this.props.bets.data !== null && (
    <FlatList
      style={styles.Bets__list}
      data={this.props.bets.data}
      keyExtractor={(bet: Bet): string => `${bet.id}`}
      onRefresh={this.fetchBets}
      refreshing={this.props.bets.isLoading}
      renderItem={({ item: bet }): React.Node => (
        <View style={styles.Bets__item}>
          <Image style={styles.Bets__itemImage} source={{ uri: this.props.user.data.imageUrl }} />
          <View style={styles.Bet__itemContent}>
            <Text styles={styles.Bet__itemMeta}>{bet.wager}</Text>
          </View>
        </View>
      )}
    />
  );

  render(): React.Node {
    const { bets } = this.props;
    return (
      <View style={[styles.Bets, bets.isLoading && styles.Bets_splash]}>
        {bets.isLoading ? (
          <ActivityIndicator size="large" color={Colors.brand.primary} />
        ) : this.renderBets()}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetsContainer);
