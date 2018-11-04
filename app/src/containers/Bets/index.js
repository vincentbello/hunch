// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Query } from 'react-apollo';

import GET_BETS from 'graphql/queries/getBets';

import { BET_VIEW_TYPES } from 'constants/view-types';
import { getBets, getViewIndex, getBetListType } from 'selectors/bets';
import { cancelRequest, fetchBets, remind, setViewIndex } from 'actions/bets';

import { type Bet, type BetListType } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import BetList from 'components/BetList';
import TabView from 'components/TabView';

type ReduxProps = {
  user: UserState,
  viewIndex: number,
  betListType: BetListType,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  betListType: getBetListType(state),
  user: state.user,
  viewIndex: getViewIndex(state),
});

// Any actions to map to the component?
const mapDispatchToProps = (dispatch: Action => any) => ({
  actions: {
    ...bindActionCreators({ setViewIndex }, dispatch),
  }
});

type Props = ReduxProps & {
  actions: {
    setViewIndex: (viewIndex: number) => void,
  },
};

function BetsContainer({ actions, betListType, user, viewIndex }) {
  return (
    <TabView
      navigationState={{
        index: viewIndex,
        routes: BET_VIEW_TYPES,
      }}
      onIndexChange={actions.setViewIndex}
      renderScene={(): React.Node => <BetList betListType={betListType} user={user.data} />}
    />
  );
}
BetsContainer.displayName = 'BetsContainer';

export default connect(mapStateToProps, mapDispatchToProps)(BetsContainer);
