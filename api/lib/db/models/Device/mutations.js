import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import DeviceType, { DeviceOsType } from './type';

export default models => ({
  registerDevice: {
    type: GraphQLInt,
    args: {
      os: {
        type: DeviceOsType,
        description: 'Operating system the device is on',
      },
      token: {
        type: new GraphQLNonNull(GraphQLString),
        description: 'Device token',
      },
    },
    resolve: async function (_, { os, token }, context) {
      console.log('RESOLVING...');
      const [instance, initialized] = await models.Device.findOrBuild({ where: { userId: context.userId, token } });
      console.log('INITIALIZED...');
      if (!initialized) return null;

      const now = new Date();
      await instance.update({
        type: os,
        token,
        allowedNotifications: true, // Placeholder
        userId: context.userId,
        createdAt: now,
        updatedAt: now,
      });
      return instance.id;
    },
  },
});
