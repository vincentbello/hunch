// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BET_VIEW_TYPES } from 'constants/view-types';
import { getBets, getViewIndex, getViewType } from 'selectors/bets';
import { cancelRequest, fetchBets, remind, setViewIndex } from 'actions/bets';

import { type Bet, type ViewType } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStylesWithNav } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';

import BetCell from 'components/BetCell';
import PromiseStateSplash from 'components/PromiseStateSplash';
import TabView from 'components/TabView';
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
    ...bindActionCreators({ cancelRequest, fetchBets, remind, setViewIndex }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    cancelRequest: (betId: number, index: number) => void,
    fetchBets: (viewType: ViewType) => void,
    remind: (betId: number) => void,
    setViewIndex: (viewIndex: number) => void,
  },
};

const styles = StyleSheet.create({
  Bets: {
    flex: 1,
  },
});

class BetsContainer extends React.Component<Props> {
  static displayName = 'BetsContainer';

  componentWillMount() {
    this.props.actions.fetchBets('requested');
    if (!this.props.bets.didFetch) this.fetchBets();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.viewType !== this.props.viewType && !this.props.bets.didFetch) this.fetchBets();
  }

  fetchBets = (): void => {
    this.props.actions.fetchBets(this.props.viewType);
  };

  renderBets = (): React.Node => {
    const { actions, bets, user, viewType } = this.props;
    if (bets.data === null) return null;
    if (bets.data.length === 0) return <Splash heading={`You have no ${viewType} bets.`} iconName="slash" />;

    return (
      <FlatList
        data={bets.data}
        keyExtractor={(bet: Bet): string => `${bet.id}`}
        onRefresh={this.fetchBets}
        refreshing={bets.isLoading}
        renderItem={({ item, index }): React.Node => (
          <BetCell
            bet={item}
            userId={user.data.id}
            onPress={(): void => Actions.betCard({ betId: item.id })}
            cancelRequest={(): void => actions.cancelRequest(item.id, index)}
            remind={(): void => actions.remind(item.id)}
          />
        )}
      />
    );
  };

  renderView = (): React.Node => <PromiseStateSplash promiseState={this.props.bets}>{this.renderBets()}</PromiseStateSplash>;

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
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetsContainer);
