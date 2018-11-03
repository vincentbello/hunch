// @flow
import * as React from 'react';
import { connect } from 'react-redux';

import { type ReduxState } from 'types/state';
import { type ReduxState as UserState } from 'reducers/user';

import NavButton from 'components/NavButton';

type ReduxProps = {
  numRequests: number,
};

// What data from the store shall we send to the component?
const mapStateToProps = (state: ReduxState): ReduxProps => ({
  numRequests: 0, //getNumBets(state, { betListType: 'requested' }),
});

type Props = ReduxProps;

const InboxButton = ({ numRequests }: Props) => (
  <NavButton badgeCount={numRequests} iconName="inbox" leftBadge targetScene="requestedBets" />
);

InboxButton.displayName = 'InboxButtonContainer';

export default connect(mapStateToProps)(InboxButton);
