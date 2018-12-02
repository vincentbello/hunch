// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';

import GET_BETS from 'graphql/queries/getBets';
import GET_USERS from 'graphql/queries/getUsers';

import NavButton from 'components/NavButton';

type Props = {
  numRequests: number,
  targetScene: string,
};

const InboxButton = ({ numRequests, targetScene }: Props) => (
  <NavButton badgeCount={numRequests} iconName="inbox" leftBadge targetScene={targetScene} />
);

InboxButton.displayName = 'InboxButtonContainer';

export default compose(
  graphql(GET_BETS, {
    options: () => ({ variables: { betListType: 'REQUESTED' } }),
    props: ({ data: { bets } }) => ({ numRequests: bets ? bets.length : 0 }),
    skip: ({ targetScene }) => targetScene !== 'requestedBets',
  }),
  graphql(GET_USERS, {
    options: { variables: { userListType: 'FRIEND_REQUESTS' } },
    props: ({ data: { users } }) => ({ numRequests: users ? users.length : 0 }),
    skip: ({ targetScene }) => targetScene !== 'friendRequests',
  }),
)(InboxButton);
