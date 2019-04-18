import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import jwt from 'jsonwebtoken';
import UserType from './type';
import { AuthenticationError } from '../../../utils/apollo/errors';

export default models => ({
  login: {
    type: UserType,
    resolve: function(_root, _args, context) {
      if (!context.user) throw new AuthenticationError('Unable to log in.');
      context.res.cookie('accessToken', context.user.accessToken, { httpOnly: true });
      context.res.cookie('refreshToken', context.user.refreshToken, { httpOnly: true });
      return context.user;
    },
  },

  logout: {
    type: UserType,
    resolve: async function(_root, _args, context) {
      const user = await models.User.findById(context.userId);
      user.set('accessToken', '');
      user.set('refreshToken', '');
      context.res.cookie('accessToken', { httpOnly: true });
      context.res.cookie('refreshToken', { httpOnly: true });
      return await user.save();
    },
  },

  refreshAuth: {
    type: UserType,
    args: {
      refreshToken: {
        description: 'The refresh token to refresh authentication',
        type: GraphQLString,
      },
    },
    resolve: async function(root, { refreshToken }, context, info) {
      const token = refreshToken || context.req.cookies.refreshToken;
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
      if (!decoded.id) throw new AuthenticationError('Invalid refresh token.');

      const user = await models.User.findById(decoded.id);
      if (!user || token !== user.refreshToken) throw new AuthenticationError('This user does not exist.');

      // Refresh access token
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: 60 * 120 });
      user.set('accessToken', accessToken);
      context.res.cookie('accessToken', accessToken, { httpOnly: true });
      context.res.cookie('refreshToken', token, { httpOnly: true });
      return await user.save();
    },
  },
});
