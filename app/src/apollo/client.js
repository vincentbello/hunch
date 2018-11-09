import ApolloClient from 'apollo-client';
import cache from './cache';
import link from './link';

export default new ApolloClient({
  cache,
  link,
});
