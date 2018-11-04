import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { API_URL } from 'react-native-dotenv';
import cache from './cache';

export default new ApolloClient({
  link: new HttpLink({ uri: `${API_URL}/graphql` }),
  cache,
});
