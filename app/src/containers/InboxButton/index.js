// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';

import GET_HUNCHES from 'graphql/queries/getHunches';
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
  graphql(GET_HUNCHES, {
    options: () => ({ variables: { hunchListType: 'REQUESTED' } }),
    props: ({ data: { hunches } }) => ({ numRequests: hunches ? hunches.length : 0 }),
    skip: ({ targetScene }) => targetScene !== 'requestedHunches',
  }),
  graphql(GET_USERS, {
    options: { variables: { userListType: 'FRIEND_REQUESTS' } },
    props: ({ data: { users } }) => ({ numRequests: users ? users.length : 0 }),
    skip: ({ targetScene }) => targetScene !== 'friendRequests',
  }),
)(InboxButton);
