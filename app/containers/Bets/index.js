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
  Bets__list: {
    marginTop: 8,
  },
  Bets__item: {
    flexDirection: 'row',
    height: 68,
    backgroundColor: 'white',
    borderRadius: 2,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
  },
  Bets__itemImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.primary.gray,
  },
  Bets__itemContent: {
    flex: 1,
  },
  Bets__itemHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  Bets__itemLink: {
    fontWeight: '800',
  },
  Bets__itemLabel: {
    color: Colors.primary.green,
    fontSize: 20,
    fontWeight: '900',
  },
  Bets__itemMeta: {
    flex: 1,
    fontSize: 14,
  },
  Bets__itemBody: {
    flex: 1,
    fontSize: 13,
    color: Colors.primary.gray,
  },
});

class BetsContainer extends React.Component<Props> {
  static displayName = 'BetsContainer';

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
      renderItem={({ item: bet }): React.Node => {
        const isBettor = bet.bettor.id === this.props.user.data.id;
        const other = isBettor ? bet.bettee : bet.bettor;
        return (
          <View style={styles.Bets__item}>
            {other.imageUrl !== null && <Image style={styles.Bets__itemImage} source={{ uri: other.imageUrl }} />}
            <View style={styles.Bets__itemContent}>
              <View style={styles.Bets__itemHeader}>
                <Text style={styles.Bets__itemMeta}>
                  {isBettor ? (
                    <React.Fragment>
                      You bet <Text style={styles.Bets__itemLink}>{other.fullName}</Text>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Text style={styles.Bets__itemLink}>{other.fullName}</Text> bet you
                    </React.Fragment>
                  )}
                </Text>
                <Text style={styles.Bets__itemLabel}>${bet.amount}</Text>
              </View>
              <Text style={styles.Bets__itemBody}>“{bet.wager}”</Text>
            </View>
          </View>
        );
      }}
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

export default connect(mapStateToProps, mapDispatchToProps)(BetsContainer);
