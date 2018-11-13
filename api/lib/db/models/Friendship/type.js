import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import UserType from '../User/type';
import models from '../';

export default new GraphQLObjectType({
  name: 'Friendship',
  description: 'A friendship between two Hunch users',
  fields: {
    ...attributeFields(models.Friendship),
    user: {
      type: UserType,
      description: 'The user who initiated the friendship',
    },
    friend: {
      type: UserType,
      description: 'The user who is the target of the friendship',
    },
  },
});
