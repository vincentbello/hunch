// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { TabBar, TabView } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BET_VIEW_TYPES } from 'constants/bet-view-types';
import { getBets, getViewIndex, getViewType } from 'selectors/bets';
import { fetchBets, setViewIndex } from 'actions/bets';

import { type Bet, type ViewType } from 'types/bet';
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
  user: UserState,
  viewIndex: number,
  viewType: ViewType,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  bets: getBets(state),
  user: state.user,
  viewIndex: getViewIndex(state),
  viewType: getViewType(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ fetchBets, setViewIndex }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    fetchBets: (viewType: ViewType) => void,
    setViewIndex: (viewIndex: number) => void,
  },
};

const styles = StyleSheet.create({
  Bets: {
    flex: 1,
  },
  Bets__indicator: {
    backgroundColor: Colors.brand.primary,
  },
  Bets__tab: {
    padding: 4,
  },
  Bets__tabbar: {
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  Bets__label: {
    color: Colors.brand.primary,
    fontSize: 13,
    fontWeight: 'bold',
  },
});

class BetsContainer extends React.Component<Props> {
  static displayName = 'BetsContainer';

  componentWillMount() {
    this.props.actions.fetchBets('requested');
    if (!this.props.bets.didFetch) this.fetchBets();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.viewType !== this.props.viewType) {
      if (!this.props.bets.didFetch) this.fetchBets();
    }
  }

  fetchBets = (): void => {
    this.props.actions.fetchBets(this.props.viewType);
  };

  renderBets = (): React.Node => {
    const { bets, user, viewType } = this.props;
    if (bets.data === null) return null;
    if (bets.data.length === 0) return <Splash heading={`You have no ${viewType} bets.`} iconName="slash" />;

    return (
      <FlatList
        data={bets.data}
        keyExtractor={(bet: Bet): string => `${bet.id}`}
        onRefresh={this.fetchBets}
        refreshing={bets.isLoading}
        renderItem={({ item }): React.Node => (
          <BetCell
            bet={item}
            userId={user.data.id}
            onPress={(): void => Actions.betCard({ betId: item.id })}
          />
        )}
      />
    );
  };

  renderTabBar = (props): React.Node => (
    <TabBar
      {...props}
      indicatorStyle={styles.Bets__indicator}
      labelStyle={styles.Bets__label}
      tabStyle={styles.Bets__tab}
      style={styles.Bets__tabbar}
    />
  );

  renderView = (): React.Node => (
    this.props.bets.isLoading ? (
      <ActivityIndicator size="large" color={Colors.brand.primary} />
    ) : this.renderBets()
  );

  render(): React.Node {
    const { actions, bets, viewIndex, viewType } = this.props;
    return (
      <TabView
        navigationState={{
          index: viewIndex,
          routes: BET_VIEW_TYPES,
        }}
        onIndexChange={actions.setViewIndex}
        renderScene={this.renderView}
        renderTabBar={this.renderTabBar}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetsContainer);
