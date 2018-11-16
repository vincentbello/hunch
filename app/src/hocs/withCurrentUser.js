// @flow
import * as React from 'react';
import { Query } from 'react-apollo';
import GET_CURRENT_USER from 'graphql/queries/getCurrentUser';

import { type User } from 'types/user';

export type CurrentUserProps = {
  currentUser: User,
};

export default function withApolloClient<P>(Component: React.ComponentType<P>): React.ComponentType<P & CurrentUserProps> {
  return (props: P): React.Node => (
    <Query query={GET_CURRENT_USER}>
      {({ data }): React.Node => (
        data && data.currentUser ? <Component {...props} currentUser={data.currentUser} /> : null
      )}
    </Query>
  );
}
