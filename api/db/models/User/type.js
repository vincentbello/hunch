import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export default new GraphQLObjectType({
  name: 'User',
  description: 'A Hunch user',
  fields: attributeFields(models.User),
});
