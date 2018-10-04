// @flow
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getNumBets } from 'selectors/bets';
import { fetchBets } from 'actions/bets';

import { type Bet } from 'types/bet';
import { type Action, type PromiseState } from 'types/redux';
import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import { SplashStyles } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';

import NavButton from 'components/NavButton';

type ReduxProps = {
  numRequests: number,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  numRequests: getNumBets(state, { listType: 'requested' }),
});

type Props = ReduxProps;

const styles = StyleSheet.create({});

const InboxButton = ({ numRequests }: Props) => (
  <NavButton badgeCount={numRequests} iconName="inbox" leftBadge targetScene="requestedBets" />
);

InboxButton.displayName = 'InboxButtonContainer';

export default connect(mapStateToProps)(InboxButton);
