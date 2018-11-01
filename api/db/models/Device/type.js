import { GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export default new GraphQLObjectType({
  name: 'Device',
  description: 'A Hunch user device',
  fields: attributeFields(models.Device),
});
