import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import jwt from 'jsonwebtoken';
import UserType from './type';
import { AuthenticationError } from '../../../utils/apollo/errors';

export default models => ({
  login: {
    type: UserType,
    resolve: async function(_root, _args, context) {
      if (!context.user) throw new Error('Something went wrong.');
      return context.user;
    },
  },

  logout: {
    type: UserType,
    resolve: async function(_root, _args, context) {
      const user = await models.User.findById(context.userId);
      user.set('accessToken', '');
      user.set('refreshToken', '');
      return await user.save();
    },
  },

  refreshAuth: {
    type: UserType,
    args: {
      refreshToken: {
        description: 'The refresh token to refresh authentication',
        type: GraphQLNonNull(GraphQLString),
      },
    },
    resolve: async function(root, { refreshToken }, context, info) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      if (!decoded.id) throw new AuthenticationError('Invalid refresh token.');

      const user = await models.User.findById(decoded.id);
      if (!user || refreshToken !== user.refreshToken) throw new AuthenticationError('This user does not exist.');

      // Refresh access token
      user.set('accessToken', jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: 60 * 120 }));
      return await user.save();
    },
  },
});
