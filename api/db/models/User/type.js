import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export const UserListType = new GraphQLEnumType({
  name: 'UserListType',
  description: 'Types of user lists',
  values: {
    FRIENDS: { description: 'Friends of the authenticated user' },
  },
});

export default new GraphQLObjectType({
  name: 'User',
  description: 'A Hunch user',
  fields: attributeFields(models.User),
});
