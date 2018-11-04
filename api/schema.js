import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { queries, mutations } from './db/models/fields';

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => queries,
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutation',
    fields: () => mutations,
  })
});
