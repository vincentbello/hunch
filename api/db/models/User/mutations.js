import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { Op } from 'sequelize';
import { resolver } from 'graphql-sequelize';
import jwt from 'jsonwebtoken';
import UserType from './type';

export default models => ({
  refreshAuth: {
    type: UserType,
    args: {
      refreshToken: {
        description: 'The refresh token to refresh authentication',
        type: GraphQLString,
      },
    },
    resolve: async function(root, { refreshToken }, context, info) {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      if (!decoded.id) throw new Error('Invalid refresh token.');

      const user = await models.User.findById(decoded.id);
      if (!user || refreshToken !== user.refreshToken) throw new Error('This user does not exist.');

      // Refresh access token
      user.set('accessToken', jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: 60 * 120 }));
      await user.save();

      return user;
    },
  },
});
