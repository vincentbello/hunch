// @flow
import * as React from 'react';
import { graphql } from 'react-apollo';
import GET_USER from 'graphql/queries/getUser';

import { type Error } from 'types/apollo';
import { type User } from 'types/user';

import DerivedStateSplash from 'components/DerivedStateSplash';
import UserCard from 'components/UserCard';

type Props = {
  userId: number,
  userQuery: {
    loading: boolean,
    error: Error,
    user: User,
  },
};

const UserCardContainer = ({ userQuery: { loading, error, user } }: Props): React.Node => (
  <DerivedStateSplash error={error} loading={loading}>
    {Boolean(user) && <UserCard user={user} />}
  </DerivedStateSplash>
);

UserCardContainer.displayName = 'UserCardContainer';
export default graphql(GET_USER, { name: 'userQuery', options: ({ userId: id }) => ({ variables: { id } }) })(UserCardContainer);
