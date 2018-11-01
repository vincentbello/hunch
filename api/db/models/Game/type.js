import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export default new GraphQLObjectType({
  name: 'Game',
  description: 'A sports game',
  fields: attributeFields(models.Game),
});
