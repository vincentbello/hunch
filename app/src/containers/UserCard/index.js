// @flow
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import GET_USER from 'graphql/queries/getUser';

import { type Error } from 'types/apollo';
import { type User } from 'types/user';

import withCurrentUser, { type CurrentUserProps } from 'hocs/withCurrentUser';
import DerivedStateSplash from 'components/DerivedStateSplash';
import UserCard from 'components/UserCard';

type Props = CurrentUserProps & {
  userId: number,
  userQuery: {
    loading: boolean,
    error: Error,
    user: User,
  },
};

const UserCardContainer = ({ currentUser, userQuery: { loading, error, user } }: Props): React.Node => (
  <DerivedStateSplash error={error} loading={loading}>
    {Boolean(user) && <UserCard isCurrent={user.id === currentUser.id} user={user} />}
  </DerivedStateSplash>
);

UserCardContainer.displayName = 'UserCardContainer';
export default compose(
  withCurrentUser,
  graphql(GET_USER, { name: 'userQuery', options: ({ userId: id }) => ({ variables: { id } }) })
)(UserCardContainer);