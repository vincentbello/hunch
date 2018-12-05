import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import UserType from '../User/type';
import models from '../';

export default new GraphQLObjectType({
  name: 'Favorite',
  description: 'The record of a favorite entity',
  fields: {
    ...attributeFields(models.Bet),
    user: {
      type: UserType,
      description: 'The user who favorited this entity',
    },
  },
});
