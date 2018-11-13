import { GraphQLEnumType, GraphQLObjectType } from 'graphql';
import { attributeFields } from 'graphql-sequelize';
import models from '../';

export const DeviceOsType = new GraphQLEnumType({
  name: 'DeviceOsType',
  description: 'Operating system type for a device',
  values: {
    ANDROID: { description: 'Android' },
    IOS: { description: 'iOS' },
  },
});

export default new GraphQLObjectType({
  name: 'Device',
  description: 'A Hunch user device',
  fields: attributeFields(models.Device),
});
