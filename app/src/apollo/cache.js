import { InMemoryCache } from 'apollo-cache-inmemory';
import { toIdValue } from 'apollo-utilities';

const cache = new InMemoryCache({
  cacheRedirects: {
    Query: {
      bet: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Bet', id: args.id })),
      game: (_, args) => toIdValue(cache.config.dataIdFromObject({ __typename: 'Game', id: args.id })),
    },
  },
});

export default cache;
