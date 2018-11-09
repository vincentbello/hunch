// @flow
import * as React from 'react';
import ApolloClient from 'apollo-client';
import { ApolloConsumer } from 'react-apollo';

type EnhancedProps = {
  apolloClient: ApolloClient,
};

export default function withApolloClient<P>(Component: React.ComponentType<P>): React.ComponentType<P & EnhancedProps> {
  return (props: P): React.Node => (
    <ApolloConsumer>
      {(client: ApolloClient): React.Node => <Component {...props} apolloClient={client} />}
    </ApolloConsumer>
  );
}
