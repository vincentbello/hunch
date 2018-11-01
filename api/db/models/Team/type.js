import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export default new GraphQLObjectType({
  name: 'Team',
  description: 'A sports team',
  fields: attributeFields(models.Team),
});
