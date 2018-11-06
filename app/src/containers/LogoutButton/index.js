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
import { logOut } from 'actions/user';

import { SplashStyles } from 'theme/app';
import Colors from 'theme/colors';
import Typography from 'theme/typography';

import NavButton from 'components/NavButton';

type ReduxProps = {
  user: UserState,
  logOut: (userId: number) => void,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch: Action => any): ReduxProps => ({ ...bindActionCreators({ logOut }, dispatch) });

const LogoutButton = (props: ReduxProps) => (
  <NavButton iconName="log-out" onClick={(): void => props.logOut(props.user.data.id)} />
);

LogoutButton.displayName = 'LogoutButtonContainer';
export default connect(mapStateToProps, mapDispatchToProps)(LogoutButton);
