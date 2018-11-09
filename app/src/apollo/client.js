import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { API_URL } from 'react-native-dotenv';
import cache from './cache';

const httpLink = new HttpLink({ uri: `${API_URL}/graphql` });

const authLink = setContext((_, { headers }) => {
  return { headers };
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});
