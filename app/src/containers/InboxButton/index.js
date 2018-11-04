// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';

import GET_BETS from 'graphql/queries/getBets';

import NavButton from 'components/NavButton';

type Props = {
  numRequests: number,
};

const InboxButton = ({ numRequests }: Props) => (
  <NavButton badgeCount={numRequests} iconName="inbox" leftBadge targetScene="requestedBets" />
);

InboxButton.displayName = 'InboxButtonContainer';

export default graphql(GET_BETS, {
  options: () => ({ variables: { betListType: 'REQUESTED' } }),
  props: ({ data: { bets } }) => ({ numRequests: bets ? bets.length : 0 })
})(InboxButton);
